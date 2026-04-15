const service = require("../services/project.service");
const notificationSocket = require("../sockets/index");

exports.create = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy thông tin người tạo từ token
    const data = await service.createProject(req.body, userId);

    // Emit universal notification to the project room
    await notificationSocket.emitNotification({
      projectId: data._id,
      userId,
      action: "created",
      entityType: "project",
      entityData: data
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getProjects();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.updateProject(req.params.id, req.body, req.userId);

    // Emit universal notification to the project room
    await notificationSocket.emitNotification({
      projectId: req.params.id,
      userId: req.userId,
      action: "updated",
      entityType: "project",
      entityData: data
    });

    res.json(data);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteProject(req.params.id, req.userId);

    // For deletion, we need to emit before actually deleting
    // Since the project is deleted, we'll emit with the projectId from params
    await notificationSocket.emitNotification({
      projectId: req.params.id,
      userId: req.userId,
      action: "deleted",
      entityType: "project",
      entityData: { _id: req.params.id, name: "Deleted Project" }
    });

    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};