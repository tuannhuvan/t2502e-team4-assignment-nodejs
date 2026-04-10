const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: String,
  content: String,
  link: String,

  isRead: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Notification", schema);