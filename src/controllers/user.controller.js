const service = require("../services/user.service");

exports.create = async (req, res) => {
  const data = await service.createUser(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await service.getUsers();
  res.json(data);
};

exports.getProfile = async (req, res) => {
  const data = await service.getUserById(req.userId);
  res.json(data);
};

exports.update = async (req, res) => {
  try {
    const data = await service.updateUser(req.userId, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteUser(req.userId);
    res.json({ msg: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};