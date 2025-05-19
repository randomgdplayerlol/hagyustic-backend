// Controllers/productController.js
// Handles product CRUD operations, image upload/removal, filtering, and sorting

import mongoose from "mongoose";
import Product from "../Models/Product.js";
import { createError } from "../Utils/Error.js";
import cloudinary from "../Config/cloudinary.js";

// @desc    Get all products with filters, search, and sorting
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
  try {
    const { mainCategory, category, size, color, name, sort } = req.query;
    const andConditions = [];

    // Filter by main category (case-insensitive)
    if (mainCategory) {
      andConditions.push({
        mainCategory: { $regex: new RegExp(`^${mainCategory}$`, "i") },
      });
    }

    // Filter by category (supports multiple comma-separated values)
    if (category) {
      const categories = category.split(",").map((item) => new RegExp(`^${item}$`, "i"));
      andConditions.push({ category: { $in: categories } });
    }

    // Filter by size and color
    if (size) andConditions.push({ availableSizes: { $in: size.split(",") } });
    if (color) andConditions.push({ availableColors: { $in: color.split(",") } });

    // Search by product name
    if (name) andConditions.push({ name: { $regex: name, $options: "i" } });

    const query = andConditions.length ? { $and: andConditions } : {};

    // Sort logic
    let sortQuery = { createdAt: -1 };
    if (sort === "lowToHigh") sortQuery = { price: 1 };
    else if (sort === "highToLow") sortQuery = { price: -1 };
    else if (sort === "newest") sortQuery = { createdAt: -1 };

    const products = await Product.find(query).sort(sortQuery);

    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(createError(500, `Failed to fetch products: ${error.message}`));
  }
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    const product = await Product.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(createError(500, `Failed to fetch product: ${error.message}`));
  }
};

// @desc    Create a new product (with Cloudinary image upload)
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      color,
      size,
      category,
      mainCategory,
      availableSizes,
      availableColors,
    } = req.body;


    // Validate required fields
    if (!name || !price || !description || !color || !size || !category || !mainCategory) {
      return next(createError(400, "All fields are required"));
    }

    // Validate image files
    const imageFiles = req.files;
    if (!imageFiles?.length) {
      return next(createError(400, "At least one image is required"));
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "hagyustic/products",
              transformation: {
                width: 800,
                height: 800,
                crop: "limit",
                quality: 90,
                fetch_format: "auto",
              },
            },
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
          );
          stream.end(file.buffer);
        });
      })
    );

    const product = new Product({
      name,
      price,
      description,
      images: imageUrls,
      color,
      size,
      category,
      mainCategory,
      availableSizes: availableSizes?.split(",") || [],
      availableColors: availableColors?.split(",") || [],
    });

    await product.save();

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(createError(500, `Failed to create product: ${error.message}`));
  }
};

// @desc    Add new images to a product
// @route   PUT /api/products/:id/images
// @access  Private (Admin)
export const addImagesToProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imageFiles = req.files;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    if (!imageFiles?.length) {
      return next(createError(400, "At least one image is required"));
    }

    const product = await Product.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    const imageUrls = await Promise.all(
      imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "hagyustic/products",
              transformation: {
                width: 800,
                height: 800,
                crop: "limit",
                quality: 90,
                fetch_format: "auto",
              },
            },
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
          );
          stream.end(file.buffer);
        });
      })
    );

    product.images.push(...imageUrls);
    await product.save();

    res.status(200).json({
      status: true,
      message: "Images added successfully",
      data: product,
    });
  } catch (error) {
    next(createError(500, `Failed to add images: ${error.message}`));
  }
};

// @desc    Delete an image from a product
// @route   DELETE /api/products/image
// @access  Private (Admin)
export const deleteImageFromProduct = async (req, res, next) => {
  try {
    const { id, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    if (!imageUrl) {
      return next(createError(400, "Image URL is required"));
    }

    const product = await Product.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    const imageIndex = product.images.indexOf(imageUrl);
    if (imageIndex === -1) {
      return next(createError(404, "Image not found in product"));
    }

    // Extract publicId for Cloudinary deletion
    const publicId = imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")
      .slice(0, -1)
      .join(".");

    await cloudinary.uploader.destroy(publicId);

    product.images.splice(imageIndex, 1);
    await product.save();

    res.status(200).json({
      status: true,
      message: "Image deleted successfully",
      data: product,
    });
  } catch (error) {
    next(createError(500, `Failed to delete image: ${error.message}`));
  }
};

// @desc    Update product details (excluding images)
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      color,
      size,
      category,
      mainCategory,
      availableSizes,
      availableColors,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    const product = await Product.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    // Update only provided fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.color = color || product.color;
    product.size = size || product.size;
    product.category = category || product.category;
    product.mainCategory = mainCategory || product.mainCategory;
    product.availableSizes = availableSizes
      ? availableSizes.split(",")
      : product.availableSizes;
    product.availableColors = availableColors
      ? availableColors.split(",")
      : product.availableColors;

    await product.save();

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(createError(500, `Failed to update product: ${error.message}`));
  }
};

// @desc    Delete a product and all its images from Cloudinary
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    const product = await Product.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    // Delete all associated images from Cloudinary
    await Promise.all(
      product.images.map((imageUrl) => {
        const publicId = imageUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")
          .slice(0, -1)
          .join(".");
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(createError(500, `Failed to delete product: ${error.message}`));
  }
};


// @desc    Bulk delete products
// @route   DELETE /api/products/bulk
// @access  Private (Admin)
export const deleteBulkProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(createError(400, "No products selected for deletion"));
    }

    // Step 1: Fetch products with their images
    const productsToDelete = await Product.find({ _id: { $in: ids } });

    // Step 2: Delete all associated Cloudinary images
    await Promise.all(
      productsToDelete.flatMap((product) =>
        product.images.map((imageUrl) => {
          const publicId = imageUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")
            .slice(0, -1)
            .join(".");
          return cloudinary.uploader.destroy(publicId);
        })
      )
    );

    // Step 3: Delete from database
    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: true,
      message: "Products and images deleted successfully",
    });
  } catch (error) {
    next(createError(500, "Failed to delete products"));
  }
};

