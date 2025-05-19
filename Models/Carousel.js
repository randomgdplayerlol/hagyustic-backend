// Models/Carousel.js
// Mongoose schema for homepage carousels (e.g., hero banners with category links)

import mongoose from "mongoose";

// Define schema for carousel entries
const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing spaces
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
        // Validate image URLs using a basic regex
        validate: {
          validator: function (url) {
            return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);
          },
          message: "Invalid image URL",
        },
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true, // Used to map to frontend product category
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the model
const Carousel = mongoose.model("Carousel", carouselSchema);
export default Carousel;
