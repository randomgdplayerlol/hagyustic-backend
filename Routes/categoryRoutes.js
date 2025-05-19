// Routes/categoryRoutes.js
// Public access route to fetch main shop categories (e.g., MEN, WOMEN, etc.)

import express from "express";
import { getAllCategories } from "../Controllers/categoryController.js";

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories for homepage/category page
// @access  Public
router.get("/", getAllCategories);

export default router;
