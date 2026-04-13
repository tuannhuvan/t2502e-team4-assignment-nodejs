const Project = require("../models/Project");

exports.createProject = async (data) => {
  return await Project.create({
    name: data.name
  });
};

exports.getProjects = async () => {
  return await Project.find();
};

exports.updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};