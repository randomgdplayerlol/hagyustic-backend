// Models/Product.js
// Mongoose schema for storing product listings in the eCommerce store

import mongoose from "mongoose";

// Define product schema with variations and validation
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Prevent negative pricing
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        // Basic image URL validation (supports http & https)
        validate: {
          validator: function (url) {
            return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);
          },
          message: "Invalid image URL",
        },
      },
    ],
    color: {
      type: String,
      required: true, // Currently selected color
    },
    size: {
      type: String,
      required: true, // Currently selected size
    },
    category: {
      type: String,
      required: true, // e.g. "T-Shirts", "Shoes"
    },
    mainCategory: {
      type: String,
      required: true, // e.g. "MEN", "WOMEN", "CHILD"
    },
    availableSizes: [
      {
        type: String, // e.g. ["S", "M", "L", "XL"]
      },
    ],
    availableColors: [
      {
        type: String, // e.g. ["Red", "Black", "White"]
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0, // Prevent negative stock
    },
  },
  {
    timestamps: true, // Automatically tracks createdAt and updatedAt
  }
);

// Create and export the model
const Product = mongoose.model("Product", productSchema);
export default Product;
