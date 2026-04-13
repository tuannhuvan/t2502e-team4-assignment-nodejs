const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,

  targetId: mongoose.Schema.Types.ObjectId,
  targetModel: String,

  details: Object
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", schema);