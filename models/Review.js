const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    avatar: { type: String, required: true },
    movie: { type: String, required: true },
    movieId: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Review", schema);
