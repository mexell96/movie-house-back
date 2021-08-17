const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, ref: "Role" },
    theme: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = model("User", schema);
