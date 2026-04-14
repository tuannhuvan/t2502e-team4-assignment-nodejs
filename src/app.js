const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/projects",      require("./routes/project.routes"));
app.use("/api/tasks",         require("./routes/task.routes"));
app.use("/api/comments",      require("./routes/comment.routes"));
app.use("/api/users",         require("./routes/user.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/activities",    require("./routes/activity.routes"));
// Auth routes used by login.ejs (/api/auth/login) and register.ejs (/api/auth/register)
app.use("/api/auth",          require("./routes/auth.routes"));

// ─── View Routes ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.render("dashboard", {
    landingMode: true,
    currentProject: null,
    currentProjectMembers: [],
    activeTasks: [],
    totalTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0
  });
});

// Dashboard
app.get("/dashboard", (req, res) => {
  const currentProject = {
    id: 1,
    name: "TaskFlow - Mini Trello",
    description: "Team assignment for NodeJS + Express + MongoDB with realtime updates.",
    ownerName: "Nhữ Văn Tuấn",
    memberCount: 4,
    createdAt: "2026-04-01 08:00",
    updatedAt: "2026-04-09 09:30"
  };

  const currentProjectMembers = [
    { userId: 1, name: "Nhữ Văn Tuấn",   github: "tuannhuvan",  dob: "2000-01-15", avatar: "/images/tuan.jpg", role: "Owner"  },
    { userId: 2, name: "Nguyễn Hữu Trí", github: "Ooloobooloo", dob: "2000-08-10", avatar: "/images/tri.jpg",  role: "Member" },
    { userId: 3, name: "Nguyễn Văn Linh",github: "nhoi03",      dob: "2004-03-23", avatar: "/images/linh.jpg", role: "Member" },
    { userId: 4, name: "Nguyễn Xuân Tùng",github: "XuanTung2493",dob: "2000-05-12",avatar: "/images/tung.jpg", role: "Member" }
  ];

  const activeTasks = [
    {
      id: 1, projectId: 1,
      title: "Collect requirements",
      description: "Review assignment scope, ERD and task distribution for the team.",
      status: "todo", priority: "high",
      assigneeId: 1, assigneeName: "Nhữ Văn Tuấn",
      deadline: "2026-04-10", updatedAt: "2026-04-06 11:15"
    },
    {
      id: 2, projectId: 1,
      title: "Design dashboard UI",
      description: "Build personal dashboard, stats cards and kanban layout with EJS.",
      status: "in_progress", priority: "medium",
      assigneeId: 4, assigneeName: "Nguyễn Xuân Tùng",
      deadline: "2026-04-12", updatedAt: "2026-04-08 14:20"
    },
    {
      id: 3, projectId: 1,
      title: "Create task detail page",
      description: "Prepare task detail UI with task information and comment section.",
      status: "in_progress", priority: "high",
      assigneeId: 2, assigneeName: "Nguyễn Hữu Trí",
      deadline: "2026-04-11", updatedAt: "2026-04-09 08:45"
    },
    {
      id: 4, projectId: 1,
      title: "Setup project structure",
      description: "Organize views, partials, public assets and initial routing.",
      status: "done", priority: "low",
      assigneeId: 1, assigneeName: "Nhữ Văn Tuấn",
      deadline: "2026-04-05", updatedAt: "2026-04-03 10:00"
    }
  ];

  res.render("dashboard", {
    landingMode: false,
    currentProject,
    currentProjectMembers,
    activeTasks,
    totalTasks: activeTasks.length,
    overdueTasks: activeTasks.filter(task => new Date(task.deadline) < new Date() && task.status !== "done").length,
    inProgressTasks: activeTasks.filter(task => task.status === "in_progress").length,
    doneTasks: activeTasks.filter(task => task.status === "done").length
  });
});

// Task Routes
app.get("/task/create", (req, res) => {
  res.render("task-create");
});

app.get("/task/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const tasks = [
    {
      id: 1, projectId: 1,
      title: "Collect requirements",
      description: "Review assignment scope, ERD and task distribution for the team.",
      status: "todo", priority: "high",
      assigneeId: 1, assigneeName: "Nhữ Văn Tuấn",
      deadline: "2026-04-10", updatedAt: "2026-04-06 11:15"
    },
    {
      id: 2, projectId: 1,
      title: "Design dashboard UI",
      description: "Build personal dashboard, stats cards and kanban layout with EJS.",
      status: "in_progress", priority: "medium",
      assigneeId: 4, assigneeName: "Nguyễn Xuân Tùng",
      deadline: "2026-04-12", updatedAt: "2026-04-08 14:20"
    }
  ];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send("Task not found");
  res.render("task-detail", { task });
});

app.get("/task/:taskId/edit", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = { id: taskId, title: "Sample Task", description: "Sample description" };
  res.render("task-edit", { task });
});

app.get("/task/:taskId/delete", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = { id: taskId, title: "Sample Task", description: "Sample description" };
  if (!task) return res.status(404).send("Task not found");
  res.render("task-delete", { task });
});

module.exports = app;
