const service = require("../services/comment.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");
const Task = require("../models/Task");

exports.create = async (req, res) => {
  const data = await service.createComment(req.body);
  if (!data) {
    return res.status(400).json({ message: "Failed to create comment" });
  }

  const user = await userService.getUserById(req.userId);

  // Get the task to find the projectId
  const task = await Task.findById(data.task);
  if (task) {
    notificationSocket.emitProjectNotification(task.projectId, {
      title: "New Comment",
      message: `${user.fullName || user.email} commented on task "${task.title}": "${data.content?.substring(0, 50)}${data.content?.length > 50 ? '...' : ''}"`,
      type: "info",
      comment: data,
      action: "commented",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  }

  res.json(data);
};

exports.getByTask = async (req, res) => {
  const data = await service.getByTask(req.params.taskId);
  res.json(data);
};