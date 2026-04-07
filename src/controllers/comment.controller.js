const service = require("../services/comment.service");

exports.create = async (req, res) => {
  const data = await service.createComment(req.body);
  res.json(data);
};

exports.getByTask = async (req, res) => {
  const data = await service.getByTask(req.params.taskId);
  res.json(data);
};