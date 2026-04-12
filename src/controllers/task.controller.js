const service = require("../services/task.service");
const notificationSocket = require("../sockets/action.notification");

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

  notificationSocket.emitTaskNotification({
    title: "Task Updated",
    message: `Task \"${data.title || data.name || data._id}\" was updated.`,
    type: "info",
    task: data,
    action: "updated"
  });

  res.json(data);
};

exports.remove = async (req, res) => {
  const deleted = await service.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  notificationSocket.emitTaskNotification({
    title: "Task Deleted",
    message: `Task with id ${req.params.id} was deleted.`,
    type: "warning",
    task: deleted,
    action: "deleted"
  });

  res.json({ msg: "Deleted" });
};