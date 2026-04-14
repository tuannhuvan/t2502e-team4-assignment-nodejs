const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const taskService = require("./services/task.service");
const projectService = require("./services/project.service");
const userService = require("./services/user.service");
const auth = require("./middleware/auth.middleware");
require("dotenv").config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const token = req.cookies?.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.isLoggedIn = true;
      res.locals.userId = decoded.userId;
    } catch (err) {
      res.locals.isLoggedIn = false;
    }
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});
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

app.get("/login", (req, res) => {
  res.render("login", { isLoggedIn: false });
});

app.get("/register", (req, res) => {
  res.render("register", { isLoggedIn: false });
});


// Dashboard
app.get("/dashboard", auth.ensureAuthenticated, async (req, res) => {
  try {
    const currentProject = await projectService.getProjects().then(projects => projects[0] || null);
    let activeTasks = [];
    let currentProjectMembers = [];

    if (currentProject) {
      activeTasks = await taskService.getTasksByProject(currentProject._id);
      activeTasks = activeTasks.map(task => ({
        ...task.toObject ? task.toObject() : task,
        id: task._id,
        assigneeName: task.assignee?.fullName || "Unassigned"
      }));

      currentProjectMembers = currentProject.members?.map(member => ({
        userId: member.user,
        name: member.name || "Team member",
        github: member.github || "",
        dob: member.dob || "",
        avatar: member.avatar || "/images/avatar-placeholder.png",
        role: member.role || "Member"
      })) || [];
    }

    res.render("dashboard", {
      landingMode: false,
      currentProject,
      currentProjectMembers,
      activeTasks,
      totalTasks: activeTasks.length,
      overdueTasks: activeTasks.filter(task => {
        const deadline = task.deadline ? new Date(task.deadline) : null;
        return deadline instanceof Date && !isNaN(deadline) && deadline < new Date() && task.status !== "done";
      }).length,
      inProgressTasks: activeTasks.filter(task => task.status === "in_progress").length,
      doneTasks: activeTasks.filter(task => task.status === "done").length
    });
  } catch (error) {
    console.error(error);

    res.render("dashboard", {
      landingMode: false,
      currentProject: null,
      currentProjectMembers: [],
      activeTasks: [],
      totalTasks: 0,
      overdueTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0
    });
  }
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
