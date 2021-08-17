const { Router } = require("express");
const Review = require("../models/Review");
const router = Router();
const authMiddleware = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");

router.post(
  "/create-review",
  authMiddleware,
  [
    check("avatar", "Choose avatar").exists(),
    check("movieId", "Choose movie").exists(),
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("rating", "Specify the rating").exists(),
    check("review", "Minimum length review 2 symbols").isLength({ min: 2 }),
    check("uid", "Minimum length uid 2 symbols").isLength({ min: 2 }),
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

      const newReview = req.body;
      console.log(req.user.id, "req.user.id 555");

      const review = new Review({
        ...newReview,
        owner: req.user.id,
      });

      await review.save();

      res.status(201).json({ review, message: "Review ready" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Something register error - ${error.message}` });
    }
  }
);

module.exports = router;
