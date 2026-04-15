const service = require("../services/task.service");
const notificationSocket = require("../sockets/index");
const userService = require("../services/user.service");

exports.create = async (req, res) => {
  const data = await service.createTask(req.body);
  res.json(data);
};

exports.getByProject = async (req, res) => {
  const data = await service.getTasksByProject(req.params.projectId);
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await service.updateTask(req.params.id, req.body);
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