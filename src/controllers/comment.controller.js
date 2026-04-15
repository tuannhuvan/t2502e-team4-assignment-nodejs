const service = require("../services/comment.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");
const Task = require("../models/Task");

exports.create = async (req, res) => {
  const commentData = {
    ...req.body,
    user: req.userId // Lưu thông tin người tạo comment
  };
  const data = await service.createComment(commentData);
  if (data) {
    const task = await Task.findById(data.task);
    if (task) {
      // Emit universal notification
      await notificationSocket.emitNotification({
        projectId: task.projectId,
        userId: req.userId,
        action: "đã thêm bình luận",
        entityType: "comment",
        entityData: data,
      });
  }
  }
  res.json(data);
};

exports.getByTask = async (req, res) => {
  const data = await service.getByTask(req.params.taskId);
  res.json(data);
};