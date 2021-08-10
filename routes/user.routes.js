const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

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

router.post("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.name = "Igor";
    await user.save();
    res.status(201).json({ ...user._doc, message: "Updated user" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
});

module.exports = router;
