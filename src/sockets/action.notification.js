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
