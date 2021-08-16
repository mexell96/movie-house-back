const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    avatar: { type: String, required: true },
    date: { type: Number, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    owner: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Review", schema);
