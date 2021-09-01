const ReviewModel = require("../models/review-model");

class ReviewService {
  async getReviews(id) {
    const reviews = await ReviewModel.find({ movieId: id });
    return reviews;
  }

  async createReview({
    avatar,
    movie,
    movieId,
    name,
    rating,
    review,
    uid,
    owner,
  }) {
    const newReview = await ReviewModel.create({
      avatar,
      movie,
      movieId,
      name,
      rating,
      review,
      uid,
      owner,
    });
    return newReview;
  }
}

module.exports = new ReviewService();
