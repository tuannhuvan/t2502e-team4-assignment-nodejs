const Notification = require("../models/Notification");
const User = require("../models/User");
exports.createNotification = async (data) => {
  return await Notification.create({
    ...data,
    isRead: false
  });
};

exports.getNotifications = async () => {
  return await Notification.find().populate("recipient", "fullName")
  .populate("sender", "fullName avartar")
  .sort({ createdAt: -1 });
};

exports.getByUser = async (userId) => {
  return await Notification.find({ recipient: userId })
    .populate("sender", "fullName avatar")
    .sort({ createdAt: -1 });
};

exports.markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};

exports.deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};