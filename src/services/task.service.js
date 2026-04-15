const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (data) => {
  const newTask = await Task.create(data);
  // Tự động cập nhật id của task mới vào mảng thú tự trong project
  await Project.findByIdAndUpdate(
    data.projectId,
    { $push: {taskOrdersIds: newTask._id}}
  );
  return newTask;
};

exports.getTasksByProject = async (projectId) => {
  return await Task.find({ projectId, isDeleted: false }).populate("assignees", "fullName email avatar")
  .sort({ createdAt: 1 }); // Sắp xếp theo thứ tự tạo ra (cũ nhất đến mới nhất)
};

exports.updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true })
  .populate("assignees", "fullName email avatar");
};

exports.deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (task) {
    // Cập nhật lại mảng thứ tự task trong project khi xóa task đồng thời xóa id task khỏi mảng thứ tự
    await Project.findByIdAndUpdate(
      task.projectId,
      { $pull: {taskOrdersIds: id}}
    );
    return await Task.findByIdAndDelete(id);
  } 
}; 