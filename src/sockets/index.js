const { Server } = require("socket.io");
const User = require("../models/User");
let io;

const NOTIFICATION_TEMPLATES = {
  task: {
    created: (user, entity) => ({
      title: "Thẻ mới",
      message: `${user.fullName || user.email} đã tạo thẻ "${entity.title}".`,
      type: "success"
    }),
    updated: (user, entity) => ({
      title: "Cập nhật thẻ",
      message: `${user.fullName || user.email} đã sửa thẻ "${entity.title}".`,
      type: "info"
    }),
    moved: (user, entity, additionalData) => ({
      title: "Di chuyển thẻ",
      // SỬA: Kiểm tra dữ liệu để tránh hiển thị 'undefined'
      message: `${user.fullName || user.email} đã chuyển "${entity.title}" từ ${additionalData.oldStatus || '...'} sang ${additionalData.newStatus || '...'}.`,
      type: "info"
    }),
    deleted: (user, entity) => ({
      title: "Xóa thẻ",
      message: `${user.fullName || user.email} đã xóa thẻ "${entity.title}".`,
      type: "warning"
    })
  },
  comment: {
    created: (user, entity, taskTitle) => ({
      title: "Bình luận mới",
      message: `${user.fullName || user.email} bình luận tại "${taskTitle}": "${entity.content?.substring(0, 50)}..."`,
      type: "info"
    })
  },
  project: {
    created: (user, entity) => ({ title: "Dự án mới", message: `${user.fullName} đã tạo dự án "${entity.name}".`, type: "success" }),
    updated: (user, entity) => ({ title: "Cập nhật dự án", message: `${user.fullName} đã sửa dự án "${entity.name}".`, type: "info" }),
    deleted: (user, entity) => ({ title: "Xóa dự án", message: `${user.fullName} đã xóa dự án "${entity.name}".`, type: "warning" })
  }
};

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    socket.on("join-project", (projectId) => {
      if (projectId) {
        socket.join(`project-${projectId}`);
      }
    });

    // Xử lý kéo thả để đồng bộ hóa các cột trên UI ngay lập tức
    socket.on("task-dragged", (data) => {
      const { projectId, taskId, oldStatus, newStatus } = data;
      socket.to(`project-${projectId}`).emit("task-updated-realtime", {
        taskId,
        oldStatus,
        newStatus
      });
    });

    socket.on("leave-project", (projectId) => {
      if (projectId) socket.leave(`project-${projectId}`);
    });
  });

  return io;
};

exports.emitNotification = async (options) => {
  const { projectId, userId, user: userOption, action, entityType, entityData, additionalData = {} } = options;

  if (!io || !projectId) return;

  try {
    let user = userOption || await User.findById(userId);
    if (!user) return;

    const template = NOTIFICATION_TEMPLATES[entityType]?.[action];
    if (!template) return;

    // SỬA: Truyền thêm additionalData vào template để xử lý logic 'moved'
    const notificationData = template(user, entityData, additionalData);

    io.to(`project-${projectId}`).emit("notification", {
      ...notificationData,
      entityType,
      action,
      entity: entityData,
      user: {
        id: user._id,
        fullName: user.fullName,
        avatar: user.avatar // Thêm avatar để UI hiển thị đẹp hơn
      },
      timestamp: new Date(),
      ...additionalData
    });
  } catch (error) {
    console.error("Socket Notification Error:", error);
  }
};