// Routes/productRoutes.js
// Manages product browsing (public) and CRUD operations (admin)

import express from "express";
import {
  addImagesToProduct,
  createProduct,
  deleteBulkProducts,
  deleteImageFromProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../Controllers/productController.js";
import upload from "../Middleware/multer.js";
import { verifyAdmin, verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Fetch all products with optional filters/sorting
// @access  Public
router.get("/", getAllProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   POST /api/products
// @desc    Create a new product with image upload
// @access  Private (Admin)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.array("images", 5),
  createProduct
);

// @route   POST /api/products/:id/images
// @desc    Add new images to an existing product
// @access  Private (Admin)
router.post(
  "/:id/images",
  verifyToken,
  verifyAdmin,
  upload.array("images", 5),
  addImagesToProduct
);

// @route   DELETE /api/products/:id/images
// @desc    Remove a specific image from a product
// @access  Private (Admin)
router.delete("/:id/images", verifyToken, verifyAdmin, deleteImageFromProduct);

// @route   PUT /api/products/:id
// @desc    Update product details (excluding images)
// @access  Private (Admin)
router.put("/:id", verifyToken, verifyAdmin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product and all images from Cloudinary
// @access  Private (Admin)
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

// @route   DELETE /api/products/bulk
// @desc    Delete multiple products by IDs
// @access  Private (Admin)
router.delete("/bulk", verifyToken, verifyAdmin, deleteBulkProducts);


export default router;
