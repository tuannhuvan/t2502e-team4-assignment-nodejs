const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String
}, { timestamps: true });

module.exports = mongoose.model("Comment", schema);