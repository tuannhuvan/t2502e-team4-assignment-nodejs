const service = require("../services/task.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");
const activityService = require("../services/activity.service");

exports.create = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      assignee: req.body.assigneeId,
      createdBy: req.userId // Luu thông tin người tạo từ task
    };
    const data = await service.createTask(taskData);

    // Tự động lưu Activity Log cho giao diện Task
    await activityService.createLog({
      user: req.userId,
      action: "đã tạo thẻ",
      targetId: data._id,
      targetModel: "Task",
      details: { projectId: data.projectId, taskTitle: data.title }
    });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getByProject = async (req, res) => {
  const data = await service.getTasksByProject(req.params.projectId);
  res.json(data);
};

exports.update = async (req, res) => {
  try {
    const taskData = { ...req.body };
    if (taskData.assigneeId) {
      taskData.assignee = req.body.assigneeId;
      delete taskData.assigneeId; // Xóa trường tạm thời để tránh lỗi khi cập nhật
    }
    const data = await service.updateTask(req.params.id, taskData);
    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

  // Emit universal notification
    await notificationSocket.emitNotification({
      projectId: data.projectId,
      userId: req.userId,
      action: "updated",
      entityType: "task",
      entityData: data
    });

    res.json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.remove = async (req, res) => {
  const deleted = await service.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Emit universal notification
  await notificationSocket.emitNotification({
    projectId: deleted.projectId,
    userId: req.userId,
    action: "deleted",
    entityType: "task",
    entityData: deleted
  });

  res.json({ msg: "Deleted" });
};