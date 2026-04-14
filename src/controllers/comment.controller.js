const service = require("../services/comment.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");
const Task = require("../models/Task");

exports.create = async (req, res) => {
  const commentData = {
    ...req.body,
    user: req.userId
  };
  const data = await service.createComment(commentData);
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
  // Transform user.fullName to authorName
  const transformed = data.map(c => ({
    ...c,
    id: c._id,
    authorName: c.user?.fullName || "Unknown"
  }));
  res.json(transformed);
};