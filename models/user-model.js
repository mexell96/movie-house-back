const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    theme: { type: String },
    avatar: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  { timestamps: true }
);

module.exports = model("User", schema);
