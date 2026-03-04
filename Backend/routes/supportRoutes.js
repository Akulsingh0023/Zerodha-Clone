import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createSupportTicket } from "../controllers/supportController.js";

const router = express.Router();

const userOnly = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  next();
};

// POST /api/support
router.post("/", protect, userOnly, createSupportTicket);

export default router;
