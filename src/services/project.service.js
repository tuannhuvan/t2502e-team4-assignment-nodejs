const Project = require("../models/Project");

exports.createProject = async (data, userId) => {
  return await Project.create({
    name: data.name,
    description: data.description,
    owner: userId,
    taskOrdersIds: [],
  });
};

exports.getProjects = async () => {
  return await Project.find().populate("owner", "fullName email");
};

exports.getProjectDetails = async (projectId) => {
  // Lấy thông tin chi tiết của dự án, bao gồm cả thông tin thành viên
  return await Project.findById(projectId)
    .populate({
      path: "members.user",
      select: "fullName avatar email"
    }).lean();
};
 // Thêm logic cập nhật thứ tự Task (phục vụ drag & drop)
exports.moveTaskOrder = async (projectId, newTaskOrderIds) => {
  return await Project.findByIdAndUpdate(projectId, { taskOrdersIds: newTaskOrderIds }, { new: true });
};

exports.updateProject = async (id, data, userId) => {
  const project = await Project.findById(id);
  
  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can update this project");
  }

  return await Project.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProject = async (id, userId) => {
  const project = await Project.findById(id);
  
  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can delete this project");
  }

  return await Project.findByIdAndDelete(id);
};