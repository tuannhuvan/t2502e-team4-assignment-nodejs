const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },

  status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  deadline: { type: Date },
  tags: [String],

  attachments: [{
    fileName: String,
    fileUrl: String
  }],

  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

schema.index({ projectId: 1, title: 1 }); // Tạo index cho projectId và title để tăng tốc tìm kiếm

module.exports = mongoose.model("Task", schema);