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
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Same response for security
    if (!user) {
      return res.status(200).json({
        message:
          "If this email is registered, you will receive a reset link.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message:
        "If this email is registered, you will receive a reset link.",
    });
  } catch (error) {
    console.log("Forgot Password Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Reset Password Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
