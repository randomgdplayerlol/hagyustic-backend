// Routes/carouselRoutes.js
// Handles carousel slide creation, update, deletion, and fetching for homepage UI

import express from "express";
import {
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  getAllCarouselSlides,
} from "../Controllers/carouselController.js";
import upload from "../Middleware/multer.js";
import { verifyToken, verifyAdmin } from "../Middleware/auth.js";

const router = express.Router();

// @route   GET /api/carousel
// @desc    Get all carousel slides
// @access  Public
router.get("/", getAllCarouselSlides);

// @route   POST /api/carousel
// @desc    Create a new carousel slide (requires exactly 3 images)
// @access  Private (Admin)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.array("images", 3),
  createCarouselSlide
);

// @route   PUT /api/carousel/:id
// @desc    Update an existing carousel slide (replace all 3 images)
// @access  Private (Admin)
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.array("images", 3),
  updateCarouselSlide
);

// @route   DELETE /api/carousel/:id
// @desc    Delete a carousel slide and its images
// @access  Private (Admin)
router.delete("/:id", verifyToken, verifyAdmin, deleteCarouselSlide);

export default router;
