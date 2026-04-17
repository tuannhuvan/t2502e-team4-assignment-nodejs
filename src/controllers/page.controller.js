const projectService = require("../services/project.service");
const taskService = require("../services/task.service");
const userService = require("../services/user.service");

exports.showTaskCreate = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.userId);
    const users = await userService.getUsers();
    res.render("task-create", { projects, users });
  } catch (error) {
    console.error("Task create page error:", error);
    res.render("task-create", { projects: [], users: [] });
  }
};

exports.showProjectCreate = (req, res) => {
  res.render("project-create", { errorMessage: null });
};

exports.createProject = async (req, res) => {
  try {
    await projectService.createProject(req.body, req.userId);
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Project create page error:", error);
    return res.render("project-create", { errorMessage: error.message || "Unable to create project" });
  }
};

exports.showTaskDetail = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).render("error", { message: "Task not found" });
    }

    let projectMembers = [];
    if (task.projectId) {
      const project = await projectService.getProjectById(task.projectId);
      if (project) {
        projectMembers = (project.members || [])
          .filter(member => member.status === 'accepted' && member.user)
          .map(member => ({
            userId: member.user._id,
            fullName: member.user.fullName || member.user.email,
            email: member.user.email
          }));
      }
    }

    res.render("task-detail", { task, currentUserId: req.userId, projectMembers });
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
