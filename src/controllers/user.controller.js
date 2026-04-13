const service = require("../services/user.service");

exports.create = async (req, res) => {
  const data = await service.createUser(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await service.getUsers();
  res.json(data);
};

exports.getOne = async (req, res) => {
  const data = await service.getUserById(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await service.updateUser(req.params.id, req.body);
  res.json(data);
};

exports.remove = async (req, res) => {
  await service.deleteUser(req.params.id);
  res.json({ msg: "Deleted" });
};