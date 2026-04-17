const projectService = require("../services/project.service");
const taskService = require("../services/task.service");
const notificationService = require("../services/notification.service");

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
    const pendingInvites = await projectService.getUserPendingInvites(req.userId);
    const notifications = await notificationService.getByUser(req.userId);
    let currentProject = null;

    if (req.query.projectId) {
      currentProject = await projectService.getProjectIfAccessible(req.query.projectId, req.userId);
    }

    if (!currentProject && req.query.inviteProjectId) {
      currentProject = await projectService.getProjectIfPendingInvite(req.query.inviteProjectId, req.userId);
    }

    if (!currentProject) {
      currentProject = await projectService.getLatestProjectWithMembers(req.userId);
    }

    res.locals.pendingInvitesCount = pendingInvites.length;

    const currentUserProjectMember = currentProject ? (currentProject.members || []).find(member => {
      const memberId = member.user?._id?.toString?.() || member.user?.toString?.();
      return memberId === req.userId?.toString();
    }) : null;

    const currentProjectMembers = currentProject ? (currentProject.members || []).map(member => ({
      userId: member.user?._id || member.user,
      name: member.user?.fullName || "Team Member",
      github: member.user?.github || "",
      dob: member.user?.dob || "",
      avatar: member.user?.avatar || "/images/avatar-placeholder.png",
      role: member.role || "Member",
      permission: member.permission || "comment",
      status: member.status || "accepted"
    })) : [];

    const hasAcceptedAccess = !!currentProject && (
      currentProject.owner?.toString() === req.userId?.toString() ||
      currentUserProjectMember?.status === "accepted"
    );

    let activeTasks = [];
    if (currentProject && hasAcceptedAccess) {
      activeTasks = await taskService.getTasksByProject(currentProject._id);
      activeTasks = activeTasks.map(task => ({
        ...task.toObject ? task.toObject() : task,
        id: task._id,
        assigneeName: task.assignee?.fullName || "Unassigned"
      }));
    }

    const defaultWorkflow = [
      { key: "todo", label: "To Do" },
      { key: "in_progress", label: "In Progress" },
      { key: "done", label: "Done" }
    ];

    const projectWorkflow = Array.isArray(currentProject?.workflow) && currentProject.workflow.length > 0
      ? currentProject.workflow
      : defaultWorkflow;

    const unknownStatusKeys = [...new Set(activeTasks
      .map(task => task.status || "todo")
      .filter(status => !projectWorkflow.some(column => column.key === status))
    )];

    const unknownStatusColumns = unknownStatusKeys.map(key => ({
      key,
      label: key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())
    }));

    const statusCategories = [...projectWorkflow, ...unknownStatusColumns];

    const canInviteProject = !!currentProject && hasAcceptedAccess && (
      currentProject.owner?.toString() === req.userId?.toString() ||
      currentUserProjectMember?.permission === "admin"
    );

    res.render("dashboard", {
      landingMode: false,
      currentProject,
      currentProjectMembers,
      activeTasks,
      statusCategories,
      canInviteProject,
      pendingInvites,
      notifications,
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
