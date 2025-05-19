// Routes/orderRoutes.js
// Handles all user and admin order actions including creation, lookup, status updates, and analytics

import express from "express";
import {
  getUserOrders,
  getAllOrders,
  getOrderById,
  getAnalytics,
  bulkUpdateOrders,
  updateOrderStatus,
  createOrder,
} from "../Controllers/orderController.js";
import { verifyToken, verifyAdmin } from "../Middleware/auth.js";

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post("/", verifyToken, createOrder);

// @route   GET /api/orders/analytics
// @desc    Get admin analytics (sales, users, stock)
// @access  Private (Admin)
router.get("/analytics", verifyToken, verifyAdmin, getAnalytics);

// @route   GET /api/orders/all
// @desc    Get all orders (admin dashboard)
// @access  Private (Admin)
router.get("/all", verifyToken, verifyAdmin, getAllOrders);

// @route   PUT /api/orders/bulk-update
// @desc    Bulk update statuses of multiple orders
// @access  Private (Admin)
router.put("/bulk-update", verifyToken, verifyAdmin, bulkUpdateOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update status of a specific order
// @access  Private (Admin)
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

// @route   GET /api/orders
// @desc    Get all orders of the logged-in user
// @access  Private
router.get("/", verifyToken, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get specific order (user or admin)
// @access  Private
router.get("/:id", verifyToken, getOrderById);

export default router;
