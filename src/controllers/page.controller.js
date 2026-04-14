const projectService = require("../services/project.service");
const userService = require("../services/user.service");
const taskService = require("../services/task.service");

exports.showTaskCreate = async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    const users = await userService.getUsers();
    res.render("task-create", { projects, users });
  } catch (error) {
    console.error("Task create page error:", error);
    res.render("task-create", { projects: [], users: [] });
  }
};

exports.showProjectCreate = (req, res) => {
  res.render("project-create");
};

exports.showTaskDetail = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    
    if (!task) {
      return res.status(404).render("error", { message: "Task not found" });
    }

    res.render("task-detail", { task });
  } catch (error) {
    console.error("Task detail error:", error);
    res.status(500).render("error", { message: "Server error" });
  }
};

exports.showTaskEdit = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    const projects = await projectService.getProjects();
    const users = await userService.getUsers();

    if (!task) {
      return res.status(404).render("error", { message: "Task not found" });
    }

    res.render("task-edit", { task, projects, users });
  } catch (error) {
    console.error("Task edit error:", error);
    res.status(500).render("error", { message: "Server error" });
  }
};

exports.showTaskDelete = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).render("error", { message: "Task not found" });
    }

    res.render("task-delete", { task });
  } catch (error) {
    console.error("Task delete error:", error);
    res.status(500).render("error", { message: "Server error" });
  }
};
