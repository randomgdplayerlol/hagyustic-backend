// Middleware/authMiddleware.js
// Middleware to handle JWT-based user authentication and admin access control

import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { createError } from "../Utils/Error.js";

// Middleware: Verifies JWT token and attaches user to the request object
export const verifyToken = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    // Token must be present and in "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        createError(401, "Authentication token missing or malformed")
      );
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      // Verify the token using the JWT secret
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const now = Math.floor(Date.now() / 1000);
    } catch (err) {
      return next(createError(403, `Invalid or expired token: ${err.message}`));
    }

    // Fetch user associated with the token payload
    const user = await User.findById(decoded.id);

    // If no user is found, deny access
    if (!user) {
      return next(createError(401, "User not found"));
    }

    // Attach user object to request so next middleware/controllers can use it
    req.user = user;
    next();
  } catch (error) {
    // Catch-all for server-side failures
    return next(createError(500, "Server error during authentication"));
  }
};

// Middleware: Verifies if authenticated user is an admin
export const verifyAdmin = (req, res, next) => {
  // If user is not present or not an admin, block access
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Admin access required"));
  }

  // User is admin — allow access
  next();
};
