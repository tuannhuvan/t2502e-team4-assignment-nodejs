const Notification = require("../models/Notification");
const User = require("../models/User");
exports.createNotification = async (data) => {
  return await Notification.create(data);
};

exports.getNotifications = async () => {
  return await Notification.find().populate("user");
};

exports.getByUser = async (userId) => {
  return await Notification.find({ user: userId });
};

exports.markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { returnDocument: 'after' }
  );
};

exports.deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};