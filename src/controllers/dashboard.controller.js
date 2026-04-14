const projectService = require("../services/project.service");
const taskService = require("../services/task.service");

exports.showLanding = (req, res) => {
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
};

exports.showLogin = (req, res) => {
  res.render("login", { isLoggedIn: false });
};

exports.showRegister = (req, res) => {
  res.render("register", { isLoggedIn: false });
};

exports.showDashboard = async (req, res) => {
  try {
    const currentProject = await projectService.getLatestProjectWithMembers();
    let activeTasks = [];
    let currentProjectMembers = [];

    if (currentProject) {
      activeTasks = await taskService.getTasksByProject(currentProject._id);
      activeTasks = activeTasks.map(task => ({
        ...task.toObject ? task.toObject() : task,
        id: task._id,
        assigneeName: task.assignee?.fullName || "Unassigned"
      }));

      currentProjectMembers = (currentProject.members || []).map(member => ({
        userId: member.user?._id || member.user,
        name: member.user?.fullName || "Team Member",
        github: member.user?.github || "",
        dob: member.user?.dob || "",
        avatar: member.user?.avatar || "/images/avatar-placeholder.png",
        role: member.role || "Member"
      }));
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
    console.error("Dashboard render error:", error);
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
};
