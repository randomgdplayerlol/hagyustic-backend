// index.js - Entry point of the HaGyustic backend server

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import database connection
import { connectDB } from "./Database/config.js";

// Import route handlers
import authRoutes from "./Routes/authRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import orderRoutes from "./Routes/OrderRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import carouselRoutes from "./Routes/carouselRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Enable CORS for frontend requests (including credentials like cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // allow frontend dev URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Root endpoint for quick testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Register all API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/categories", categoryRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log errors for backend debugging
  console.error("Server error:", err);

  // Send JSON error response
  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
});

// Start the server only after a successful DB connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit with failure if DB connection fails
  });
