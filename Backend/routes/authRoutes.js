const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/signup.js");
const { login } = require("../controllers/login.js");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
