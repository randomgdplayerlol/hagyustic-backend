// Routes/paymentRoutes.js
// Handles Stripe and PayPal payment processing and order status updates

import express from 'express';
import {
  createCheckoutSession,
  capturePayPalPayment,
} from '../Controllers/paymentController.js';
import { verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe Checkout session for current user
// @access  Private
router.post('/create-checkout-session', verifyToken, createCheckoutSession);

// @route   POST /api/payment/paypal-capture
// @desc    Capture PayPal payment and mark order as paid
// @access  Private
router.post('/paypal-capture', verifyToken, capturePayPalPayment);

export default router;
