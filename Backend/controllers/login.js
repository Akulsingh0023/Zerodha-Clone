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
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

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
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: "Reset link sent",
    });

    (async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          pool: true,
          maxConnections: 1,
          rateDelta: 20000,
          rateLimit: 5,
          connectionTimeout: 30000,
          greetingTimeout: 30000,
          socketTimeout: 30000,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Password Reset Request",
          html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
        });
      } catch (mailError) {
        console.log("Forgot Password Mail Error:", mailError.message);
      }
    })();
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