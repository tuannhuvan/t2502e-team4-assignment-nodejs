const ActivityLog = require("../models/ActivityLog");

exports.createLog = async (data) => {
  return await ActivityLog.create(data);
};

exports.getLogs = async () => {
  return await ActivityLog.find()
    .populate("user", "fullName Avatar")
    .sort({ createdAt: -1 });
};

exports.getByTask = async (taskId) => {
  return await ActivityLog.find({ task: taskId, targetModel: "Task" })
    .populate("user", "fullName Avatar")
    .sort({ createdAt: -1 });
};

exports.getProjectActivities = async (projectId) => {
  return await ActivityLog.find({ 
    $or: [{ target: projectId }, { "details.project": projectId }]
  })
  .populate("user", "fullName Avatar email")
  .sort({ createdAt: -1 })
  .limit(20); // chỉ lấy 20 hoạt động gần nhất để tối ưu hiệu suất
};

exports.deleteLog = async (id) => {
  return await ActivityLog.findByIdAndDelete(id);
};