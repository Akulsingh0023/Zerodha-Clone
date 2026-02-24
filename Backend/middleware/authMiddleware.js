import jwt from "jsonwebtoken";
import User from "../model/User.js";

/* ==============================
   🔐 PROTECT ROUTE (LOGIN REQUIRED)
============================== */
export const protect = async (req, res, next) => {
  try {
    // Token from cookies OR Authorization header
    let token = req.cookies.token;

    if (!token) {
      // Check Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7); // Remove "Bearer " prefix
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // Token verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User fetch karna (password exclude)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Request object me user attach karna
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

/* ==============================
   👑 ADMIN ONLY ROUTE
============================== */
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};