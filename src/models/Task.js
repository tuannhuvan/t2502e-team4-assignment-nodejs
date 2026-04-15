const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,

  status: { type: String, enum: ["To Do", "In Progress", "Done"] },
  priority: { type: String, enum: ["Low", "Medium", "High"] },

  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  deadline: Date,
  tags: [String],

  attachments: [{
    fileName: String,
    fileUrl: String
  }],

  isDeleted: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Task", schema);