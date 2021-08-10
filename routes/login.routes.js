const { Router } = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, config.get("jwtSecret"), {
    expiresIn: "4h",
  });
};

// /api/login

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data when logging in",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res.status(400).json({
          message: "Wrong password, try again",
        });
      }

      const token = generateAccessToken(user._id, user.role);

      res.status(201).json({
        token,
        userId: user.id,
        message: "You entered",
      });
    } catch (error) {
      res.status(500).json({ message: `Some Error login ${error.message}` });
    }
  }
);

module.exports = router;
