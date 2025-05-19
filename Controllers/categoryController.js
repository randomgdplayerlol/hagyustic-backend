// Controllers/categoryController.js
// Returns a list of all main product categories (currently hardcoded)

import { createError } from "../Utils/Error.js";

// Temporary hardcoded category list (can be moved to MongoDB later)
const categories = [
  {
    name: "MEN",
    mainCategory: "MEN",
    image: "https://res.cloudinary.com/dmupw3asw/image/upload/v1746951619/Men_udyw5e.avif",
  },
  {
    name: "WOMEN",
    mainCategory: "WOMEN",
    image: "https://res.cloudinary.com/dmupw3asw/image/upload/v1746951619/Women_aheo21.avif",
  },
  {
    name: "CHILD",
    mainCategory: "CHILD",
    image: "https://res.cloudinary.com/dmupw3asw/image/upload/v1746951619/Child_oav81m.avif",
  },
  {
    name: "ACCESSORIES",
    mainCategory: "ACCESSORIES",
    image: "https://res.cloudinary.com/dmupw3asw/image/upload/v1746951620/Accessories_rjffv8.avif",
  },
];

// @desc    Get all categories (MEN, WOMEN, CHILD, ACCESSORIES)
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    // Respond with the hardcoded category list
    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    // In real usage, this error is unlikely since it's a static array
    next(createError(500, `Failed to fetch categories: ${error.message}`));
  }
};
