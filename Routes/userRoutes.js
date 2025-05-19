// Routes/userRoutes.js
// Manages user profile, password updates, and admin user listing

import express from "express";
import {
  getUserProfile,
  updatePassword,
  updateUser,
  getAllUsers,
  hasPlacedOrder,
} from "../Controllers/userController.js";
import { verifyToken, verifyAdmin } from "../Middleware/auth.js";

const router = express.Router();

// @route   GET /api/user
// @desc    Get authenticated user's profile
// @access  Private
router.get("/", verifyToken, getUserProfile);

// @route   PUT /api/user
// @desc    Update phone number and delivery address
// @access  Private
router.put("/", verifyToken, updateUser);

// @route   PUT /api/user/password
// @desc    Update or set new password
// @access  Private
router.put("/password", verifyToken, updatePassword);

// @route   GET /api/user/users
// @desc    Get all users (admin dashboard)
// @access  Private (Admin)
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

// @route   GET /api/user/has-placed-order
// @desc    Check if current user has placed any orders
// @access  Private
router.get("/has-placed-order", verifyToken, hasPlacedOrder);

export default router;
