import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

export default router;
