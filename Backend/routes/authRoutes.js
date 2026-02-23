// const express = require("express");
// const router = express.Router();

// const { signup } = require("../controllers/signup.js");
// const { login } = require("../controllers/login.js");

// router.post("/signup", signup);
// router.post("/login", login);

// module.exports = router;
import express from "express";
import { signup } from "../controllers/signup.js";
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/login.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { getAllUsers } from "../controllers/adminController.js";

import User from "../model/User.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

/* =========================
   PASSWORD ROUTES
========================= */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/admin/users", protect, adminOnly, getAllUsers);
/* =========================
   USER PROFILE
========================= */

// Get logged in user
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { fullname } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname || user.fullname;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   ADMIN ROUTES
========================= */

// Get all users (Admin only)
router.get("/all-users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;