const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/task/create", (req, res) => {
  const users = [
    { id: 1, name: "Nhữ Văn Tuấn" },
    { id: 2, name: "Nguyễn Hữu Trí" },
    { id: 3, name: "Nguyễn Văn Linh" },
    { id: 4, name: "Nguyễn Xuân Tùng" }
  ];

  const projects = [
    { id: 1, name: "TaskFlow - Mini Trello" }
  ];

  res.render("task-create", { users, projects });
});

app.get("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const tasks = [
    {
      id: 1,
      title: "Design login page",
      assignee: "Nguyễn Xuân Tùng",
      deadline: "2026-04-10",
      priority: "High",
      status: "todo"
    },
    {
      id: 2,
      title: "Build dashboard UI",
      assignee: "Nhữ Văn Tuấn",
      deadline: "2026-04-12",
      priority: "Medium",
      status: "inprogress"
    },
    {
      id: 3,
      title: "Create task detail page",
      assignee: "Nguyễn Hữu Trí",
      deadline: "2026-04-11",
      priority: "High",
      status: "inprogress"
    },
    {
      id: 4,
      title: "Setup project structure",
      assignee: "Nguyễn Văn Linh",
      deadline: "2026-04-08",
      priority: "Low",
      status: "done"
    },
    {
      id: 5,
      title: "Style kanban board",
      assignee: "Nguyễn Xuân Tùng",
      deadline: "2026-04-13",
      priority: "Medium",
      status: "todo"
    },
    {
      id: 6,
      title: "Prepare comment section UI",
      assignee: "Nguyễn Văn Linh",
      deadline: "2026-04-14",
      priority: "Low",
      status: "done"
    }
  ];

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.send("Task not found");
  }

  res.render("task-detail", { task });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/task/:id/edit", (req, res) => {
  const users = [
    { id: 1, name: "Nhữ Văn Tuấn" },
    { id: 2, name: "Nguyễn Hữu Trí" },
    { id: 3, name: "Nguyễn Văn Linh" },
    { id: 4, name: "Nguyễn Xuân Tùng" }
  ];

  const projects = [
    { id: 1, name: "TaskFlow - Mini Trello" }
  ];

  const tasks = [
    {
      id: 1,
      projectId: 1,
      title: "Collect requirements",
      description: "Review assignment scope, ERD and task distribution for the team.",
      status: "todo",
      priority: "high",
      assigneeId: 1,
      deadline: "2026-04-10"
    },
    {
      id: 2,
      projectId: 1,
      title: "Design dashboard UI",
      description: "Build personal dashboard, stats cards and kanban layout with EJS.",
      status: "in_progress",
      priority: "medium",
      assigneeId: 4,
      deadline: "2026-04-12"
    },
    {
      id: 3,
      projectId: 1,
      title: "Create task detail page",
      description: "Prepare task detail UI with task information and comment section.",
      status: "in_progress",
      priority: "high",
      assigneeId: 2,
      deadline: "2026-04-11"
    },
    {
      id: 4,
      projectId: 1,
      title: "Setup project structure",
      description: "Organize views, partials, public assets and initial routing.",
      status: "done",
      priority: "low",
      assigneeId: 3,
      deadline: "2026-04-08"
    }
  ];

  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return res.status(404).send("Task not found");
  }

  res.render("task-edit", { task, users, projects });
});

app.get("/task/:id/delete", (req, res) => {
  const tasks = [
    {
      id: 1,
      projectId: 1,
      title: "Collect requirements",
      description: "Review assignment scope, ERD and task distribution for the team.",
      status: "todo",
      priority: "high",
      assigneeId: 1,
      deadline: "2026-04-10"
    },
    {
      id: 2,
      projectId: 1,
      title: "Design dashboard UI",
      description: "Build personal dashboard, stats cards and kanban layout with EJS.",
      status: "in_progress",
      priority: "medium",
      assigneeId: 4,
      deadline: "2026-04-12"
    },
    {
      id: 3,
      projectId: 1,
      title: "Create task detail page",
      description: "Prepare task detail UI with task information and comment section.",
      status: "in_progress",
      priority: "high",
      assigneeId: 2,
      deadline: "2026-04-11"
    },
    {
      id: 4,
      projectId: 1,
      title: "Setup project structure",
      description: "Organize views, partials, public assets and initial routing.",
      status: "done",
      priority: "low",
      assigneeId: 3,
      deadline: "2026-04-08"
    }
  ];

  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return res.status(404).send("Task not found");
  }

  res.render("task-delete", { task });
});