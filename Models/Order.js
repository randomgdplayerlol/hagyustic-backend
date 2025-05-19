// Models/Order.js
// Mongoose schema for storing customer orders

import mongoose from "mongoose";

// Define schema for individual orders
const orderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    // List of ordered products
    items: [
      {
        productId: {
          type: String,
          required: [true, "Product ID is required"],
        },
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        size: {
          type: String,
          required: [true, "Size is required"],
        },
        color: {
          type: String,
          required: [true, "Color is required"],
        },
      },
    ],

    // Total order price
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    // Order status tracking
    status: {
      type: String,
      enum: ["Processing", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    // Stripe and PayPal IDs for payment tracking
    stripeSessionId: { type: String },
    paypalOrderId: { type: String },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the model
const Order = mongoose.model("Order", orderSchema);
export default Order;
