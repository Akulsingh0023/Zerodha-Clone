// const express = require("express");
// const router = express.Router();

// const { signup } = require("../controllers/signup.js");
// const { login } = require("../controllers/login.js");

// router.post("/signup", signup);
// router.post("/login", login);

// module.exports = router;
const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/signup.js");

const {
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/login.js");

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);

// 🔐 Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
