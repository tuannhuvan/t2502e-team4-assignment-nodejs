const service = require("../services/notification.service");

exports.create = async (req, res) => {
  const data = await service.createNotification(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await service.getNotifications();
  res.json(data);
};

exports.getByUser = async (req, res) => {
  const data = await service.getByUser(req.params.userId);
  res.json(data);
};

exports.markRead = async (req, res) => {
  const data = await service.markAsRead(req.params.id);
  if (!data) return res.status(404).json({ message: "Notification not found" });
  res.json(data);
};

exports.remove = async (req, res) => {
  await service.deleteNotification(req.params.id);
  res.json({ msg: "Deleted" });
};