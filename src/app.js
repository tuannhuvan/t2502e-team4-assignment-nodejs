const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authMiddleware = require("./middleware/auth.middleware");

const dashboardRoutes = require("./routes/dashboard.routes");
const pageRoutes = require("./routes/page.routes");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const projectRoutes = require("./routes/project.routes");
const commentRoutes = require("./routes/comment.routes");
const notificationRoutes = require("./routes/notification.routes");
const userRoutes = require("./routes/user.routes");
const activityRoutes = require("./routes/activity.routes");

const app = express();
app.use(expressLayouts);
app.set("layout", "layout");

// 1. Chỉ định thư mục views nằm trong src 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Chỉ định thư mục public nằm ngoài src 
// Dấu ".." giúp thoát khỏi src để vào public 
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "taskflow_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 3. Middleware truyền biến cho giao diện 
app.use(authMiddleware.loadUserToLocals);
app.use((req, res, next) => {
  res.locals.currentProject = null; 
  next();
});

// 4. Route modules
app.use("/", dashboardRoutes);
app.use("/", pageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);

// Root fallback page
app.get("/", (req, res) => {
  // Ép buộc render dashboard với chế độ landingMode để hiện UI ngay 
  res.render("dashboard", { 
    landingMode: true,
    currentProject: null,
    activeTasks: [],
    totalTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    currentProjectMembers: []
  });
});

module.exports = app;