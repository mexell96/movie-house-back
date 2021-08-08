const { Router } = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();
// const auth = require("../middleware/auth.middleware");

// /api/auth/register
router.post(
  "/register",
  [
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("email", "Wrong email").isEmail(),
    check("password", "Minimum length password 6 symbols").isLength({ min: 6 }),
  ],

  async (req, res) => {
    console.log(req.body, "req body register");
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data during registration",
        });
      }
      const { name, email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "User already exist" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: "User ready" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Something register error - ${error.message}` });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    console.log(req.body, "req body login");
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

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

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
