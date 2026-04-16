const service = require("../services/activity.service");

exports.create = async (req, res) => {
  try {
    const data = await service.createLog(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Đổi tên để tránh nhầm lẫn và khớp với route
exports.getAllActivities = async (req, res) => {
  try {
    const data = await service.getLogs();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectFeed = async (req, res) => {
  try {
    const data = await service.getProjectActivities(req.params.projectId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteLog(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};