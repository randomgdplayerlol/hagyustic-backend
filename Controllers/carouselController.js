// Controllers/carouselController.js
// Handles creation, updating, deletion, and retrieval of carousel slides for the homepage

import mongoose from "mongoose";
import Carousel from "../Models/Carousel.js";
import { createError } from "../Utils/Error.js";
import cloudinary from "../Config/cloudinary.js";

// @desc    Create a new carousel slide (requires 3 images)
export const createCarouselSlide = async (req, res, next) => {
  const { title, subtitle, category } = req.body;

  try {
    if (!title || !subtitle || !category) {
      return next(createError(400, "Title, subtitle, and category are required"));
    }

    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length !== 3) {
      return next(createError(400, "Exactly 3 images are required"));
    }

    // Upload all 3 images to Cloudinary
    const imageUrls = await Promise.all(
      imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "hagyustic/carousel",
              transformation: {
                height: 1080,
                crop: "fill",
                quality: 100,
                fetch_format: "auto",
              },
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );

    const newSlide = new Carousel({
      title,
      subtitle,
      images: imageUrls,
      category,
    });

    const savedSlide = await newSlide.save();

    res.status(201).json({
      status: true,
      message: "Carousel slide created successfully",
      data: savedSlide,
    });
  } catch (error) {
    next(createError(500, `Failed to create carousel slide: ${error.message}`));
  }
};

// @desc    Update an existing carousel slide
export const updateCarouselSlide = async (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, category } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid slide ID"));
    }

    const slide = await Carousel.findById(id);
    if (!slide) {
      return next(createError(404, "Slide not found"));
    }

    if (!title || !subtitle || !category) {
      return next(createError(400, "Title, subtitle, and category are required"));
    }

    // Handle new image uploads if provided
    if (req.files && req.files.length > 0) {
      if (req.files.length !== 3) {
        return next(createError(400, "Exactly 3 images are required"));
      }

      // Delete old images from Cloudinary
      await Promise.all(
        slide.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
          return cloudinary.uploader.destroy(`hagyustic/carousel/${publicId}`);
        })
      );

      // Upload new images to Cloudinary
      const imageUrls = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "hagyustic/carousel",
                transformation: {
                  height: 1080,
                  crop: "fill",
                  quality: 100,
                  fetch_format: "auto",
                },
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        })
      );

      slide.images = imageUrls;
    }

    // Update slide text values
    slide.title = title;
    slide.subtitle = subtitle;
    slide.category = category;

    const updatedSlide = await slide.save();

    res.status(200).json({
      status: true,
      message: "Carousel slide updated successfully",
      data: updatedSlide,
    });
  } catch (error) {
    next(createError(500, `Failed to update carousel slide: ${error.message}`));
  }
};

// @desc    Delete a carousel slide and remove images from Cloudinary
export const deleteCarouselSlide = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid slide ID"));
    }

    const slide = await Carousel.findById(id);
    if (!slide) {
      return next(createError(404, "Slide not found"));
    }

    // Delete images from Cloudinary
    await Promise.all(
      slide.images.map((imageUrl) => {
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        return cloudinary.uploader.destroy(`hagyustic/carousel/${publicId}`);
      })
    );

    await Carousel.deleteOne({ _id: id });

    res.status(200).json({
      status: true,
      message: "Carousel slide deleted successfully",
    });
  } catch (error) {
    next(createError(500, `Failed to delete carousel slide: ${error.message}`));
  }
};

// @desc    Retrieve all carousel slides
export const getAllCarouselSlides = async (req, res, next) => {
  try {
    const slides = await Carousel.find();

    res.status(200).json({
      status: true,
      message: "Carousel slides fetched successfully",
      data: slides,
    });
  } catch (error) {
    next(createError(500, `Failed to fetch carousel slides: ${error.message}`));
  }
};
