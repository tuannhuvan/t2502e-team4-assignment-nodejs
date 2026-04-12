const service = require("../services/project.service");

exports.create = async (req, res) => {
  try {
    const data = await service.createProject(req.body, req.user._id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getProjects();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.updateProject(req.params.id, req.body, req.user._id);
    res.json(data);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteProject(req.params.id, req.user._id);
    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};