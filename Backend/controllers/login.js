// import User from "../model/User.js";
// import bcryptjs from "bcryptjs"
// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         const isMatch = await bcryptjs.compare(password, user.password)
//         if (!user || !isMatch) {
//             return res.status(400).json({ message: "Invalid username and password" })
//         } else {
//             res.status(200).json({
//                 message: "Login successfully", user: {
//                     _id: user._id,
//                     fullname: user.fullname,
//                     email: user.email
//                 }
//             })
//         }
//     } catch (error) {
//         console.log("Error" + error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { getResendClient } from "../services/resendClient.js";

const isProd = process.env.NODE_ENV === "production";

/* =========================
   LOGIN (JWT + COOKIE)
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token, // 🔥 important for frontend if using localStorage
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET PROFILE (🔥 NEW)
========================= */
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/"
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If this email is registered, you will receive a reset link.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "https://zerodha-clone-gamma-rose.vercel.app";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        "[Resend] RESEND_API_KEY not set; skipping reset email for:",
        email
      );
    } else {
      resend.emails
        .send({
          from: "Akul Singh <onboarding@resend.dev>",
          to: email,
          subject: "Password Reset Link",
          html: `
    <p>Hi,</p>
    
    <p>Click the link below to reset your password:</p>
    
    <a href="${resetUrl}">${resetUrl}</a>
    
    <p>This link expires in 1 hour.</p>
    
    <p>If you did not request this, ignore this email.</p>
  `,
        })
        .then(() => {
          console.log("✅ Email sent to:", email);
        })
        .catch((err) => {
          console.log("❌ Resend error:", err.message);
        });
    }

    res.status(200).json({
      message:
        "If this email is registered, you will receive a reset link.",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Reset Password Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};