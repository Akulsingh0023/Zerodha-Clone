import User from "../model/User.js";
import bcrypt from "bcryptjs";

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    /* 🔹 Basic Validation */
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* 🔹 Strong Password Validation */
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars with uppercase, lowercase, number & special character",
      });
    }

    /* 🔹 Check Existing User */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /* 🔹 Hash Password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* 🔹 Create User */
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: "user", // Always user by default
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Signup Error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};