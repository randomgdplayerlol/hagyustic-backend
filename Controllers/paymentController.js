// Controllers/paymentController.js
// Handles Stripe Checkout session creation and PayPal payment capture

import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from "../Models/Order.js";

dotenv.config();

// Initialize Stripe with secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Recommended API version
});

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/stripe
// @access  Private (User)
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { items, orderId } = req.body ?? {};
    const userId = req.user?.id;

    // Validate required fields
    if (!items?.length || !orderId) {
      return res.status(400).json({
        status: false,
        message: 'Items and orderId are required',
      });
    }

    // Convert items to Stripe-compatible format
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name ?? 'Unknown Product',
          metadata: {
            size: item.size ?? 'N/A',
            color: item.color ?? 'N/A',
          },
        },
        unit_amount: Math.round((item.price ?? 0) * 100), // Price in cents
      },
      quantity: item.quantity ?? 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        userId,
        orderId,
      },
    });

    // Return checkout session URL
    res.status(200).json({ status: true, url: session.url });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

// @desc    Capture PayPal payment and update order
// @route   POST /api/payment/paypal
// @access  Private (User)
export const capturePayPalPayment = async (req, res) => {
  const { orderId, paypalOrderId } = req.body;

  try {
    if (!orderId || !paypalOrderId) {
      return res.status(400).json({
        status: false,
        message: "Order ID and PayPal Order ID are required",
      });
    }

    // Update order with payment status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        status: "Paid",
        paymentMethod: "PayPal",
        paypalOrderId,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "PayPal payment recorded successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "PayPal capture failed" });
  }
};
