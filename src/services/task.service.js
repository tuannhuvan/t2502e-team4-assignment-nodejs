const Task = require("../models/Task");

exports.createTask = async (data) => {
  return await Task.create(data);
};

exports.getTasksByProject = async (projectId) => {
  return await Task.find({ projectId }).populate("assignee", "fullName");
};

exports.getTaskById = async (id) => {
  return await Task.findById(id).populate("assignee", "fullName").lean();
};

exports.updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { returnDocument: 'after' }).populate("assignee", "fullName");
};

exports.deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};