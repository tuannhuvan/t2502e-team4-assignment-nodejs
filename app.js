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