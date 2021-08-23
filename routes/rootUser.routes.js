const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const roleMiddleware = require("../middleware/role.middleware");
const { check, validationResult } = require("express-validator");

router.delete(
  "/root-delete-user/:id",
  roleMiddleware(["SUPERADMIN"]),
  async (req, res) => {
    try {
      await User.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "User has been deleted" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
);

router.patch(
  "/root-profile-name/:id",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
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
      const user = await User.findById({ _id: req.params.id });
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
  "/root-profile-email/:id",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
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

module.exports = router;
