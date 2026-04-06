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

app.get("/task-detail", (req, res) => {
  res.render("task-detail");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});