import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

export default router;