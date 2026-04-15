const service = require("../services/activity.service");

exports.create = async (req, res) => {
  const data = await service.createLog(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await service.getLogs();
  res.json(data);
};

exports.getByTask = async (req, res) => {
  const data = await service.getByTask(req.params.taskId);
  res.json(data);
};

exports.remove = async (req, res) => {
  await service.deleteLog(req.params.id);
  res.json({ msg: "Deleted" });
};
