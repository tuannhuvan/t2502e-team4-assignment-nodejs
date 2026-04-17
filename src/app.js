const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const jwt = require("jsonwebtoken");
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
  res.locals.isLoggedIn = false;
  res.locals.userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.isLoggedIn = true;
      res.locals.userId = decoded.userId;
    } catch (err) {
      res.locals.isLoggedIn = false;
      res.locals.userId = null;
    }
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



// ─── Page Routes ──────────────────────────────────────────────────────────────
app.use("/", require("./routes/dashboard.routes"));

// Task Routes
app.use("/", require("./routes/page.routes"));

module.exports = app;
