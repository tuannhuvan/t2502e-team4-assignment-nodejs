const projectService = require("../services/project.service");
const userService = require("../services/user.service");

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

exports.showTaskDetail = (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const tasks = [
    {
      id: 1,
      projectId: 1,
      title: "Collect requirements",
      description: "Review assignment scope, ERD and task distribution for the team.",
      status: "todo",
      priority: "high",
      assigneeId: 1,
      assigneeName: "Nhữ Văn Tuấn",
      deadline: "2026-04-10",
      updatedAt: "2026-04-06 11:15"
    },
    {
      id: 2,
      projectId: 1,
      title: "Design dashboard UI",
      description: "Build personal dashboard, stats cards and kanban layout with EJS.",
      status: "in_progress",
      priority: "medium",
      assigneeId: 4,
      assigneeName: "Nguyễn Xuân Tùng",
      deadline: "2026-04-12",
      updatedAt: "2026-04-08 14:20"
    }
  ];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send("Task not found");
  res.render("task-detail", { task });
};

exports.showTaskEdit = (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = { id: taskId, title: "Sample Task", description: "Sample description" };
  res.render("task-edit", { task });
};

exports.showTaskDelete = (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = { id: taskId, title: "Sample Task", description: "Sample description" };
  if (!task) return res.status(404).send("Task not found");
  res.render("task-delete", { task });
};
