const Task = require("../models/Task");

exports.createTask = async (data) => {
  return await Task.create(data);
};

exports.getTasksByProject = async (projectId) => {
  return await Task.find({ project: projectId });
};

exports.updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};