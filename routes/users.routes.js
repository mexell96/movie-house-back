const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

// /api/users/profiles

router.get("/profiles", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
