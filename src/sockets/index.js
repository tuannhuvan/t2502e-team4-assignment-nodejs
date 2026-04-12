const { Server } = require("socket.io");
let io;

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

exports.emitTaskNotification = (data) => {
  if (!io) {
    console.warn("Socket.io not initialized. Task notification not emitted.");
    return;
  }

  io.emit("task-notification", data);
};

// Function to emit notification to specific project room
exports.emitProjectNotification = (projectId, data) => {
  if (!io) {
    console.warn("Socket.io not initialized. Project notification not emitted.");
    return;
  }

  io.to(`project-${projectId}`).emit("project-notification", data);
};