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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error) {
  if (error) {
    console.log("❌ SMTP Connection Failed:", error.message);
    console.log("❌ Error code:", error.code);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

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

    // Step 1: Check if user exists
    const user = await User.findOne({ email });

    // Step 2: If not found, return immediately
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This email is not registered",
      });
    }

    // Step 3: Generate reset token (keep existing token generation logic)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    // Step 4: Send response immediately before sending email
    res.status(200).json({
      success: true,
      message: "Reset link sent",
    });

    // Step 5: Send email in background after response
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    transporter.sendMail(mailOptions)
    .then((info) => {
      console.log("✅ Email delivered successfully");
      console.log("✅ Message ID:", info.messageId);
      console.log("✅ Accepted by:", info.accepted);
      console.log("✅ Response:", info.response);
    }).catch((err) => {
      console.log("❌ Email sending error:", err.message);
      console.log("❌ Error code:", err.code);
      console.log("❌ Full error:", err);
    });
  } catch (error) {
    console.log("Route error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" });
    }
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