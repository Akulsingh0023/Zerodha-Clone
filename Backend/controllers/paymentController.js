import crypto from "crypto";
import mongoose from "mongoose";
import User from "../model/User.js";
import WalletTransaction from "../model/WalletTransaction.js";
import { getRazorpayClient } from "../services/razorpayService.js";

const MAX_ADD_AMOUNT = Number(process.env.WALLET_MAX_ADD_AMOUNT) || 100000;

const parseAmount = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
};

export const createPaymentOrder = async (req, res) => {
  try {
    const amount = parseAmount(req.body?.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    if (amount > MAX_ADD_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Amount exceeds max limit of ₹${MAX_ADD_AMOUNT.toLocaleString("en-IN")}`,
      });
    }

    const amountPaise = Math.round(amount * 100);
    const receipt = `wallet_${req.user._id}_${Date.now()}`;

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
    });

    await WalletTransaction.create({
      userId: req.user._id,
      type: "credit",
      amount,
      reason: "wallet_add",
      status: "pending",
      orderId: order.id,
    });

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[Payment Order]", error.message || error);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Razorpay secret not configured" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    if (userId && String(userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "User mismatch" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await WalletTransaction.updateOne(
        { userId: req.user._id, orderId: razorpay_order_id },
        { $set: { status: "failed", paymentId: razorpay_payment_id } }
      );
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const txn = await WalletTransaction.findOne({
      userId: req.user._id,
      orderId: razorpay_order_id,
    });

    if (!txn) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (txn.status === "success") {
      const user = await User.findById(req.user._id).select("walletBalance");
      return res.json({ success: true, balance: user?.walletBalance ?? 0 });
    }

    if (amount && Number(amount) !== Number(txn.amount)) {
      return res.status(400).json({ success: false, message: "Amount mismatch" });
    }

    await session.withTransaction(async () => {
      await WalletTransaction.updateOne(
        { _id: txn._id },
        {
          $set: {
            status: "success",
            paymentId: razorpay_payment_id,
          },
        },
        { session }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { walletBalance: txn.amount } },
        { session }
      );
    });

    const updatedUser = await User.findById(req.user._id).select("walletBalance");

    return res.json({
      success: true,
      balance: updatedUser?.walletBalance ?? 0,
    });
  } catch (error) {
    await session.abortTransaction().catch(() => {});
    console.error("[Payment Verify]", error.message || error);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  } finally {
    session.endSession();
  }
};
