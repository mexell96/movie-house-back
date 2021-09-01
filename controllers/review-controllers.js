const reviewService = require("../service/review-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class ReviewController {
  async createReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error on create review", errors.array())
        );
      }
      await reviewService.createReview({ ...req.body });
      return res.json({ message: "You created review" });
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req, res, next) {
    try {
      const id = req.params.id;
      const reviews = await reviewService.getReviews(id);
      res.status(200).json(reviews);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ReviewController();
