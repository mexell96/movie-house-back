const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

// /api/profile/${id}

router.get("/profile/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
});

module.exports = router;
