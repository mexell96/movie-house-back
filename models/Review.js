const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    avatar: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    movieId: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Review", schema);
