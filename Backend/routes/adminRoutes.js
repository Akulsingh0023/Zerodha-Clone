import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAdminStats,
  deleteUser,
  changeUserRole,
  getUserDetails,
  getAdminInfo,
} from "../controllers/adminController.js";

const router = express.Router();

/* ==================== USER MANAGEMENT ==================== */
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:userId", protect, adminOnly, getUserDetails);
router.delete("/users/:userId", protect, adminOnly, deleteUser);
router.put("/users/:userId/role", protect, adminOnly, changeUserRole);

/* ==================== STATISTICS ==================== */
router.get("/stats", protect, adminOnly, getAdminStats);

/* ==================== ADMIN INFO ==================== */
router.get("/info", protect, adminOnly, getAdminInfo);

export default router;