const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,

  status: { type: String, default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"] },

  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  deadline: Date,
  tags: [String],

  attachments: [{
    fileName: String,
    fileUrl: String
  }],

  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],

  isDeleted: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Task", schema);