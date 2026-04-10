const service = require("../services/project.service");

exports.create = async (req, res) => {
  const data = await service.createProject(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await service.getProjects();
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await service.updateProject(req.params.id, req.body);
  res.json(data);
};

exports.remove = async (req, res) => {
  await service.deleteProject(req.params.id);
  res.json({ msg: "Deleted" });
};