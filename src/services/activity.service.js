const ActivityLog = require("../models/ActivityLog");

exports.createLog = async (data) => {
  return await ActivityLog.create(data);
};

exports.getLogs = async () => {
  return await ActivityLog.find()
    .populate("user")
    .populate("task");
};

exports.getByTask = async (taskId) => {
  return await ActivityLog.find({ task: taskId });
};

exports.deleteLog = async (id) => {
  return await ActivityLog.findByIdAndDelete(id);
};