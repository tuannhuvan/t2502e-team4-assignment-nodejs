const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true }, // Ví dụ: "đã chuyển thẻ sang cột Done"

  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetModel: { type: String, enum: ["Task", "Project"], required: true }, // Loại đối tượng bị tác động (Task, Project, Comment,...)

  details: { type: Object } // Lưu trữ thêm thông tin chi tiết về hành động (ví dụ: tên cột cũ, tên cột mới khi chuyển thẻ)
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", schema);