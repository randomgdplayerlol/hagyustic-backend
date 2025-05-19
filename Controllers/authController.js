// Controllers/authController.js
// Handles user authentication, social login, password reset, and token generation

import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../Utils/Error.js";
import { verifyToken } from "../Config/firebaseAdmin.js";
import nodemailer from "nodemailer";

dotenv.config();

// Setup: Configure Nodemailer for sending reset emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error.message);
  }
});

// Register new user with email and password
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw createError(400, "All fields are required");
    }

    let user = await User.findOne({ email });
    if (user) throw createError(400, "User already exists");

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Log in existing user with email/password
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw createError(400, "All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw createError(400, "Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createError(400, "Invalid email or password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handle login via Firebase (Google/Facebook)
export const socialLogin = async (req, res, next) => {
  const { name, email, provider, providerId, idToken } = req.body;

  try {
    if (!idToken || !email) {
      throw createError(400, "idToken and email are required");
    }

    const decodedToken = await verifyToken(idToken);
    if (decodedToken.uid !== providerId) {
      throw createError(400, "Invalid token or provider ID mismatch");
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, provider, providerId, role: "user" });
    } else {
      user.provider = provider;
      user.providerId = providerId;
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: false,
      message: error.message || "Social login failed",
    });
  }
};

// Get logged-in user’s profile
export const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw createError(404, "User not found");

    res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

// Request to send a password reset email
export const passwordResetRequest = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) throw createError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found");

    if (!user.password && user.provider) {
      throw createError(400, "Password reset not available for social login users");
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/password-reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    next(error);
  }
};

// Reset user password using token from email
export const passwordReset = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      throw createError(400, "Token and new password are required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) throw createError(400, "Invalid or expired reset token");

    // Update user password and clear reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid reset token" });
    }
    next(error);
  }
};
