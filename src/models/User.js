const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  fullName: String,
  avatar: String,
  role: { type: String, enum: ["Owner", "Member"], default: "Member" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", schema);