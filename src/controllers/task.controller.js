const service = require("../services/task.service");

exports.create = async (req, res) => {
  const data = await service.createTask(req.body);
  res.json(data);
};

exports.getByProject = async (req, res) => {
  const data = await service.getTasksByProject(req.params.projectId);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await service.updateTask(req.params.id, req.body);
  res.json(data);
};

exports.remove = async (req, res) => {
  await service.deleteTask(req.params.id);
  res.json({ msg: "Deleted" });
};