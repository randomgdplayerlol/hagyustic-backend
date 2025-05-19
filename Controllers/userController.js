// Controllers/userController.js
// Handles user profile access, update, password management, admin listing, and order check

import User from "../Models/User.js";
import { createError } from "../Utils/Error.js";
import Order from "../Models/Order.js";

// @desc    Get the authenticated user's profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw createError(404, "User not found");

    res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's phone number and delivery address
// @route   PUT /api/user/profile
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const { phoneNumber, deliveryAddress } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw createError(404, "User not found");

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (deliveryAddress !== undefined) user.deliveryAddress = deliveryAddress;

    await user.save();

    res.status(200).json({
      status: true,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update user password (supports OAuth fallback)
// @route   PUT /api/user/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      throw createError(400, "New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) throw createError(404, "User not found");

    // Allow OAuth users to set a password without needing a current one
    if (!user.password) {
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ status: true, message: "Password set successfully" });
    }

    // Require current password validation for password change
    if (!currentPassword) {
      throw createError(400, "Current password is required");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw createError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/user/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(createError(500, "Failed to fetch users"));
  }
};

// @desc    Check if user has ever placed an order
// @route   GET /api/user/has-ordered
// @access  Private
export const hasPlacedOrder = async (req, res, next) => {
  try {
    const orderExists = await Order.exists({ user: req.user._id });
    res.status(200).json({ hasPlacedOrder: !!orderExists });
  } catch (error) {
    next(error);
  }
};
