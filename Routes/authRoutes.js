// Routes/authRoutes.js
// Handles authentication, social login, password reset, and user info retrieval

import express from "express";
import {
  getUserData,
  loginUser,
  passwordReset,
  passwordResetRequest,
  registerUser,
  socialLogin,
} from "../Controllers/authController.js";
import { verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user with email/password
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login with email/password
router.post("/login", loginUser);

// @route   POST /api/auth/social-login
// @desc    Login/Register using Firebase social provider (Google/Facebook)
router.post("/social-login", socialLogin);

// @route   GET /api/auth/me
// @desc    Get current user's data (requires token)
// @access  Private
router.get("/me", verifyToken, getUserData);

// @route   POST /api/auth/password-reset-request
// @desc    Request password reset (sends email with token)
router.post("/password-reset-request", passwordResetRequest);

// @route   POST /api/auth/password-reset
// @desc    Reset password using valid token
router.post("/password-reset", passwordReset);

export default router;
