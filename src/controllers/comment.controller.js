const service = require("../services/comment.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");
const Task = require("../models/Task");

exports.create = async (req, res) => {
  const data = await service.createComment(req.body);
  if (!data) {
    return res.status(400).json({ message: "Failed to create comment" });
  }

  // Get the task to find the projectId and task title
  const task = await Task.findById(data.task);
  if (task) {
    // Emit universal notification
    await notificationSocket.emitNotification({
      projectId: task.projectId,
      userId: req.userId,
      action: "created",
      entityType: "comment",
      entityData: data,
      additionalData: {
        taskTitle: task.title
      }
    });
  }

  res.json(data);
};

exports.getByTask = async (req, res) => {
  const data = await service.getByTask(req.params.taskId);
  res.json(data);
};