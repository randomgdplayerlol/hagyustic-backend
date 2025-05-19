// Controllers/orderController.js
// Handles user orders, admin analytics, order status updates, and creation

import mongoose from "mongoose";
import Order from "../Models/Order.js";
import User from "../Models/User.js";
import Product from "../Models/Product.js";
import { createError } from "../Utils/Error.js";

// @desc    Get all orders for the authenticated user
// @access  Private (User)
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(createError(500, "Failed to fetch orders"));
  }
};

// @desc    Get all orders (for admin) with pagination
// @access  Private (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("user", "name email phoneNumber deliveryAddress")
      .sort({ createdAt: -1 });


    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(createError(500, "Failed to fetch orders"));
  }
};

// @desc    Get a single order by ID (admin or user who placed it)
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid order ID"));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    await order.populate("user", "name email phoneNumber deliveryAddress");

    // Defensive check to avoid .toString() errors
    if (!order.user || !order.user._id) {
      return next(createError(404, "User not found for this order"));
    }

    // Only allow access if user is owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(createError(403, "Not authorized to view this order"));
    }

    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(createError(500, `Failed to fetch order details: ${error.message}`));
  }
};

// @desc    Get admin dashboard analytics (sales, orders, stock, etc.)
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalOrders = await Order.countDocuments();

    const activeUsers = await Order.distinct("user").then(
      (users) => users.length
    );

    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
    });

    // Monthly sales for past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: true,
      message: "Analytics fetched successfully",
      data: {
        totalSales: totalSales[0]?.total || 0,
        totalOrders,
        activeUsers,
        lowStockProducts,
        monthlySales: monthlySales.map((sale) => ({
          month: sale._id,
          total: sale.total,
        })),
      },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch analytics"));
  }
};

// @desc    Bulk update order statuses (admin)
// @access  Private (Admin)
export const bulkUpdateOrders = async (req, res, next) => {
  const { orderIds, status } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return next(createError(400, "Order IDs are required"));
  }

  if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    return next(createError(400, "Invalid status"));
  }

  try {
    await Order.updateMany({ _id: { $in: orderIds } }, { $set: { status } });

    res.status(200).json({
      status: true,
      message: "Orders updated successfully",
    });
  } catch (error) {
    next(createError(500, "Failed to update orders"));
  }
};

// @desc    Update a single order's status (admin)
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(createError(400, "Invalid order ID"));
  }

  if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    return next(createError(400, "Invalid status"));
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(createError(500, `Failed to update order status: ${error.message}`));
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User)
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, status, stripeSessionId, paypalOrderId } =
      req.body;
    const userId = req.user._id;

    if (!items || !items.length) {
      return next(createError(400, "Order must include at least one item."));
    }

    // Normalize and sanitize item data
    const newOrder = new Order({
      user: userId,
      items: items.map((item) => ({
        productId: item.product,
        name: item.name ?? "N/A",
        quantity: item.quantity,
        price: Number(item.price) || 0,
        size: item.size,
        color: item.color,
        image: item.image ?? "",
      })),
      totalAmount,
      status: status || "Processing",
      stripeSessionId,
      paypalOrderId,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      status: true,
      order: savedOrder,
    });
  } catch (error) {
    next(createError(500, `Failed to create order: ${error.message}`));
  }
};
