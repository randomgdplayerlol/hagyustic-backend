// Database/config.js
// Handles connection to MongoDB using Mongoose

import mongoose from "mongoose"; // MongoDB ODM for Node.js
import dotenv from "dotenv";     // Loads environment variables from .env

// Load environment variables (e.g., MONGODB_URL)
dotenv.config();

// Get MongoDB connection string from environment variables
const mongodb_URL = process.env.MONGODB_URL;

// Function to establish MongoDB connection
export const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using Mongoose
    const connection = await mongoose.connect(mongodb_URL);

    // Log success message
    console.log("MongoDB connected successfully");

    // Return connection object (optional, for testing or logging)
    return connection;
  } catch (error) {
    // Log error and exit process if DB connection fails
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
