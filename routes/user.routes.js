const { Router } = require("express");
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

router.post(
  "/profile/:id",
  authMiddleware,
  [
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("email", "Wrong email").isEmail(),
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
      const { name, email } = req.body;
      const user = await User.findById(req.params.id);

      user.name = name;
      user.email = email;

      await user.save();
      res.status(201).json({ ...user._doc, message: "Updated user" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
);

module.exports = router;
