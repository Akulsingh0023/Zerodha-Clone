import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../model/User.js";

const router = express.Router();

/* ===============================
   🔹 GET LOGGED-IN USER PROFILE
================================ */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.fullname,   // 🔥 FIXED HERE
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   🔹 UPDATE LOGGED-IN USER NAME
================================ */
router.put("/me", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name cannot be empty"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullname: name.trim() },   // 🔥 FIXED HERE
      { new: true }
    ).select("-password");

    res.json({
      _id: updatedUser._id,
      name: updatedUser.fullname,
      email: updatedUser.email
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;