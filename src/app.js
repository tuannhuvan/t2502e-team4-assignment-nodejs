const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/comments", require("./routes/comment.routes"));

app.get("/", (req, res) => {
  res.json({ message: "API running without auth" });
});

module.exports = app;