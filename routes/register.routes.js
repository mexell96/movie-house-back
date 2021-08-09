const { Router } = require("express");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/register

router.post(
  "/register",
  [
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("email", "Wrong email").isEmail(),
    check("password", "Minimum length password 6 symbols").isLength({ min: 6 }),
  ],

  async (req, res) => {
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

module.exports = router;
