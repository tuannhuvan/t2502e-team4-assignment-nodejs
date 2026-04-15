const projectService = require("../services/project.service");
const userService = require("../services/user.service");
const taskService = require("../services/task.service");

exports.showTaskCreate = async (req, res) => {
  const projects = await projectService.getProjects();
  const users = await userService.getUsers();
  res.render("task-create", { projects, users });
};

exports.showTaskEdit = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    const projects = await projectService.getProjects();
    const users = await userService.getUsers();
    
    if (!task) return res.status(404).render("error", { message: "Task not found" });
    res.render("task-edit", { task, projects, users });
  } catch (err) {
    res.status(500).render("error", { message: err.message });
  }
};

exports.showProjectCreate = (req, res) => {
  res.render("project-create");
};