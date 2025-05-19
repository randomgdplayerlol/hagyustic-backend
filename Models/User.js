// Models/User.js
// Mongoose schema for user accounts including support for social login and secure password handling

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Basic email validation regex
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      // Required only if the user signs up via email/password
      required: function () {
        return !this.provider; // Skip password if using Google/Facebook login
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Only admins can access admin dashboard
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    provider: {
      type: String, // e.g. "google", "facebook"
      trim: true,
    },
    providerId: {
      type: String, // Social login unique ID
      trim: true,
    },
    resetToken: {
      type: String, // Used for password reset via email
    },
    resetTokenExpiry: {
      type: Date, // Expiry time for reset token (e.g. 1 hour)
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
    toJSON: {
      // Remove sensitive fields when converting user to JSON
      transform(doc, ret) {
        delete ret.password;
        delete ret.resetToken;
        delete ret.resetTokenExpiry;
        return ret;
      },
    },
  }
);

// Hash password before saving (only if modified or new)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords (for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
