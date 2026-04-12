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

  const user = await userService.getUserById(req.userId);

  notificationSocket.emitProjectNotification(data.projectId, {
    title: "Task Updated",
    message: `Task \"${data.title || data.name || data._id}\" was updated by ${user.fullName || user.email}.`,
    type: "info",
    task: data,
    action: "updated",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });

  res.json(data);
};

exports.remove = async (req, res) => {
  const deleted = await service.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  const user = await userService.getUserById(req.userId);

  notificationSocket.emitProjectNotification(deleted.projectId, {
    title: "Task Deleted",
    message: `Task \"${deleted.title || deleted.name || deleted._id}\" was deleted by ${user.fullName || user.email}.`,
    type: "warning",
    task: deleted,
    action: "deleted",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });

  res.json({ msg: "Deleted" });
};