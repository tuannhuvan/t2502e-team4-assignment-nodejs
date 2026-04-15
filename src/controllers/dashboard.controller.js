const projectService = require("../services/project.service");
const taskService = require("../services/task.service");

exports.showDashboard = async (req, res) => {
  try {
    // Luôn cố gắng lấy project mới nhất để hiển thị dashboard mặc định
    const currentProject = await projectService.getLatestProjectWithMembers();
    let activeTasks = [];
    let currentProjectMembers = [];

    if (currentProject) {
      activeTasks = await taskService.getTasksByProject(currentProject._id);
      
      // Transform dữ liệu để UI dễ đọc (Flat data)
      activeTasks = activeTasks.map(task => ({
        ...task.toObject(),
        id: task._id,
        assigneeName: task.assignee?.fullName || "Chưa giao"
      }));

      currentProjectMembers = (currentProject.members || []).map(member => ({
        userId: member.user?._id || null,
        name: member.user?.fullName || "Thành viên hệ thống",
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
      // Tính toán các chỉ số cho Chart/Giao diện
      inProgressTasks: activeTasks.filter(t => t.status === "in_progress").length,
      doneTasks: activeTasks.filter(t => t.status === "done").length,
      overdueTasks: activeTasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "done").length
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", { message: "Không thể tải dashboard" });
  }
};