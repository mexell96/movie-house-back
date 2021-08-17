const { Router } = require("express");
const Review = require("../models/Review");
const router = Router();
const { check, validationResult } = require("express-validator");

router.post(
  "/create-review",
  [
    check("avatar", "Choose avatar").exists(),
    check("movieId", "Choose movie").exists(),
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("rating", "Specify the rating").exists(),
    check("review", "Minimum length review 2 symbols").isLength({ min: 2 }),
    check("uid", "Minimum length uid 2 symbols").isLength({ min: 2 }),
    check("owner", "Specify the user").exists(),
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

      const review = new Review({
        ...newReview,
      });

      await review.save();

      res.status(201).json({ review, message: "Review ready" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Create review - error ${error.message}` });
    }
  }
);

router.get("/reviews/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id });
    res.status(200).json(reviews);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
});

module.exports = router;
