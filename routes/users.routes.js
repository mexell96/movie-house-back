const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const roleMiddleware = require("../middleware/role.middleware");

// /api/users/profiles

router.get("/profiles", roleMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
