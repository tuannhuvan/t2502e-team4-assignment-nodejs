const { Server } = require("socket.io");
const User = require("../models/User");
let io;

// Notification templates for different actions
const NOTIFICATION_TEMPLATES = {
  task: {
    created: (user, entity) => ({
      title: "Task Created",
      message: `${user.fullName || user.email} created task "${entity.title || entity.name}".`,
      type: "success"
    }),
    updated: (user, entity) => ({
      title: "Task Updated",
      message: `${user.fullName || user.email} updated task "${entity.title || entity.name}".`,
      type: "info"
    }),
    deleted: (user, entity) => ({
      title: "Task Deleted",
      message: `${user.fullName || user.email} deleted task "${entity.title || entity.name}".`,
      type: "warning"
    })
  },
  comment: {
    created: (user, entity, taskTitle) => ({
      title: "New Comment",
      message: `${user.fullName || user.email} commented on "${taskTitle}": "${entity.content?.substring(0, 50)}${entity.content?.length > 50 ? '...' : ''}"`,
      type: "info"
    })
  },
  project: {
    created: (user, entity) => ({
      title: "Project Created",
      message: `${user.fullName || user.email} created project "${entity.name}".`,
      type: "success"
    }),
    updated: (user, entity) => ({
      title: "Project Updated",
      message: `${user.fullName || user.email} updated project "${entity.name}".`,
      type: "info"
    }),
    deleted: (user, entity) => ({
      title: "Project Deleted",
      message: `${user.fullName || user.email} deleted project "${entity.name}".`,
      type: "warning"
    })
  }
};

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Handle join-project event
    socket.on("join-project", (projectId) => {
      if (projectId) {
        socket.join(`project-${projectId}`);
        console.log(`User ${socket.id} joined project room: project-${projectId}`);
      }
    });

    // Handle leave-project event (optional, for cleanup)
    socket.on("leave-project", (projectId) => {
      if (projectId) {
        socket.leave(`project-${projectId}`);
        console.log(`User ${socket.id} left project room: project-${projectId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Universal notification emitter
exports.emitNotification = async (options) => {
  const { projectId, userId, action, entityType, entityData, customMessage, additionalData = {} } = options;

  if (!io) {
    console.warn("Socket.io not initialized. Notification not emitted.");
    return;
  }

  if (!projectId || !userId || !action || !entityType) {
    console.warn("Missing required parameters for notification");
    return;
  }

  try {
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      console.warn("User not found for notification");
      return;
    }

    // Get notification template
    const template = NOTIFICATION_TEMPLATES[entityType]?.[action];
    if (!template) {
      console.warn(`No template found for ${entityType}.${action}`);
      return;
    }

    // Generate notification data
    const notificationData = template(user, entityData, additionalData.taskTitle);

    // Emit to project room
    io.to(`project-${projectId}`).emit("notification", {
      ...notificationData,
      entityType,
      action,
      entity: entityData,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      timestamp: new Date(),
      ...additionalData
    });

  } catch (error) {
    console.error("Error emitting notification:", error);
  }
};

// Legacy functions for backward compatibility
exports.emitTaskNotification = (data) => {
  if (!io) {
    console.warn("Socket.io not initialized. Task notification not emitted.");
    return;
  }
  io.emit("task-notification", data);
};

exports.emitProjectNotification = (projectId, data) => {
  if (!io) {
    console.warn("Socket.io not initialized. Project notification not emitted.");
    return;
  }
  io.to(`project-${projectId}`).emit("project-notification", data);
};

exports.emitToProject = (projectId, data) => {
  if (!io) {
    console.warn("Socket.io not initialized. Notification not emitted.");
    return;
  }
  io.to(`project-${projectId}`).emit("notification", data);
};