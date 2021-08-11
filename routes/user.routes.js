const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");

// /api/profile/${id}

router.get("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
});

router.patch(
  "/profile-name/:id",
  authMiddleware,
  [check("name", "Minimum length name 2 symbols").isLength({ min: 2 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data on updating user",
        });
      }
      const { name } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      user.name = name;
      await user.save();
      res.status(201).json({ ...user._doc, message: "Updated user name" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
);

router.patch(
  "/profile-email/:id",
  authMiddleware,
  [check("email", "Wrong email").isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data on updating user",
        });
      }
      const { email } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      user.email = email;
      await user.save();
      res.status(201).json({ ...user._doc, message: "Updated user email" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
);

router.patch(
  "/profile-password/:id",
  authMiddleware,
  [
    check("oldPassword", "Minimum length password 6 symbols").isLength({
      min: 6,
    }),
    check("newPassword", "Minimum length password 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data on updating user",
        });
      }
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      const isMatchPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isMatchPassword) {
        return res.status(400).json({
          message: "Wrong password, try again",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      res.status(201).json({ ...user._doc, message: "Updated user password" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
);

module.exports = router;
