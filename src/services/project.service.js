const Project = require("../models/Project");

exports.createProject = async (data, userId) => {
  return await Project.create({
    name: data.name,
    description: data.description,
    owner: userId
  });
};

exports.getProjects = async () => {
  return await Project.find();
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