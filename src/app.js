const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── Socket.IO ───────────────────────────────────────────────────────────────
io.on("connection", socket => {
  console.log(`🔥 Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

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
  res.redirect("/dashboard");
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
      assigneeId: 3, assigneeName: "Nguyễn Văn Linh",
      deadline: "2026-04-08", updatedAt: "2026-04-07 16:10"
    }
  ];

  const totalTasks      = activeTasks.length;
  const overdueTasks    = activeTasks.filter(t => new Date(t.deadline) < new Date()).length;
  const inProgressTasks = activeTasks.filter(t => t.status === "in_progress").length;
  const doneTasks       = activeTasks.filter(t => t.status === "done").length;

  res.render("dashboard", {
    currentProject, currentProjectMembers, activeTasks,
    totalTasks, overdueTasks, inProgressTasks, doneTasks
  });
});

// Projects list
app.get("/projects", (req, res) => {
  const users = [
    { id: 1, name: "Nhữ Văn Tuấn" },
    { id: 2, name: "Nguyễn Hữu Trí" },
    { id: 3, name: "Nguyễn Văn Linh" },
    { id: 4, name: "Nguyễn Xuân Tùng" }
  ];

  const projects = [
    { id: 1, name: "TaskFlow - Mini Trello",         description: "Team assignment for NodeJS + Express + MongoDB with realtime updates.", ownerId: 1, isDeleted: false, createdAt: "2026-04-01 08:00", updatedAt: "2026-04-09 09:30" },
    { id: 2, name: "Frontend UI Upgrade",             description: "Improve dashboard, task form and task detail user experience.",          ownerId: 4, isDeleted: false, createdAt: "2026-04-03 10:15", updatedAt: "2026-04-09 14:10" },
    { id: 3, name: "Realtime Notification Module",    description: "Prepare UI flow for socket events such as assignee update and comments.", ownerId: 2, isDeleted: false, createdAt: "2026-04-04 09:45", updatedAt: "2026-04-08 17:35" }
  ];

  const projectMembers = [
    { id: 1,  projectId: 1, userId: 1, role: "Owner"  },
    { id: 2,  projectId: 1, userId: 2, role: "Member" },
    { id: 3,  projectId: 1, userId: 3, role: "Member" },
    { id: 4,  projectId: 1, userId: 4, role: "Member" },
    { id: 5,  projectId: 2, userId: 4, role: "Owner"  },
    { id: 6,  projectId: 2, userId: 1, role: "Member" },
    { id: 7,  projectId: 2, userId: 3, role: "Member" },
    { id: 8,  projectId: 3, userId: 2, role: "Owner"  },
    { id: 9,  projectId: 3, userId: 1, role: "Member" },
    { id: 10, projectId: 3, userId: 4, role: "Member" }
  ];

  const projectList = projects
    .filter(p => !p.isDeleted)
    .map(p => {
      const owner   = users.find(u => u.id === p.ownerId);
      const members = projectMembers.filter(m => m.projectId === p.id);
      return { ...p, ownerName: owner ? owner.name : "Unknown", memberCount: members.length };
    });

  res.render("project-list", { projectList });
});

// Auth pages  — rendered with the layout (no duplicate HTML in those EJS files)
app.get("/login",    (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// Task: create form
app.get("/task/create", (req, res) => {
  const users    = [
    { id: 1, name: "Nhữ Văn Tuấn" },
    { id: 2, name: "Nguyễn Hữu Trí" },
    { id: 3, name: "Nguyễn Văn Linh" },
    { id: 4, name: "Nguyễn Xuân Tùng" }
  ];
  const projects = [{ id: 1, name: "TaskFlow - Mini Trello" }];
  res.render("task-create", { users, projects });
});

// Task: detail
app.get("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const tasks = [
    { id: 1, title: "Design login page",        assignee: "Nguyễn Xuân Tùng", deadline: "2026-04-10", priority: "High",   status: "todo"       },
    { id: 2, title: "Build dashboard UI",        assignee: "Nhữ Văn Tuấn",     deadline: "2026-04-12", priority: "Medium", status: "inprogress" },
    { id: 3, title: "Create task detail page",   assignee: "Nguyễn Hữu Trí",   deadline: "2026-04-11", priority: "High",   status: "inprogress" },
    { id: 4, title: "Setup project structure",   assignee: "Nguyễn Văn Linh",  deadline: "2026-04-08", priority: "Low",    status: "done"       },
    { id: 5, title: "Style kanban board",        assignee: "Nguyễn Xuân Tùng", deadline: "2026-04-13", priority: "Medium", status: "todo"       },
    { id: 6, title: "Prepare comment section UI",assignee: "Nguyễn Văn Linh",  deadline: "2026-04-14", priority: "Low",    status: "done"       }
  ];

  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send("Task not found");
  res.render("task-detail", { task });
});

// Task: edit form
app.get("/task/:id/edit", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const users    = [
    { id: 1, name: "Nhữ Văn Tuấn" },
    { id: 2, name: "Nguyễn Hữu Trí" },
    { id: 3, name: "Nguyễn Văn Linh" },
    { id: 4, name: "Nguyễn Xuân Tùng" }
  ];
  const projects = [{ id: 1, name: "TaskFlow - Mini Trello" }];
  const tasks = [
    { id: 1, projectId: 1, title: "Collect requirements",   description: "Review assignment scope, ERD and task distribution for the team.", status: "todo",        priority: "high",   assigneeId: 1, deadline: "2026-04-10" },
    { id: 2, projectId: 1, title: "Design dashboard UI",    description: "Build personal dashboard, stats cards and kanban layout with EJS.", status: "in_progress", priority: "medium", assigneeId: 4, deadline: "2026-04-12" },
    { id: 3, projectId: 1, title: "Create task detail page",description: "Prepare task detail UI with task information and comment section.",  status: "in_progress", priority: "high",   assigneeId: 2, deadline: "2026-04-11" },
    { id: 4, projectId: 1, title: "Setup project structure",description: "Organize views, partials, public assets and initial routing.",        status: "done",        priority: "low",    assigneeId: 3, deadline: "2026-04-08" }
  ];

  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send("Task not found");
  res.render("task-edit", { task, users, projects });
});

// Task: delete confirmation
app.get("/task/:id/delete", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const tasks = [
    { id: 1, projectId: 1, title: "Collect requirements",   description: "Review assignment scope, ERD and task distribution for the team.", status: "todo",        priority: "high",   assigneeId: 1, deadline: "2026-04-10" },
    { id: 2, projectId: 1, title: "Design dashboard UI",    description: "Build personal dashboard, stats cards and kanban layout with EJS.", status: "in_progress", priority: "medium", assigneeId: 4, deadline: "2026-04-12" },
    { id: 3, projectId: 1, title: "Create task detail page",description: "Prepare task detail UI with task information and comment section.",  status: "in_progress", priority: "high",   assigneeId: 2, deadline: "2026-04-11" },
    { id: 4, projectId: 1, title: "Setup project structure",description: "Organize views, partials, public assets and initial routing.",        status: "done",        priority: "low",    assigneeId: 3, deadline: "2026-04-08" }
  ];

  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send("Task not found");
  res.render("task-delete", { task });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});