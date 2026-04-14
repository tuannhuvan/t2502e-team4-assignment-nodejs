require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

// Kết nối Database
connectDB();

const EXPRESS_PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;

// Express server
const expressServer = http.createServer(app);
expressServer.listen(EXPRESS_PORT, () => {
  console.log(`Express server running on port ${EXPRESS_PORT}`);
});

// Socket.IO server on separate port
const ioServer = http.createServer();
const io = new Server(ioServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-project", (projectId) => {
    if (projectId) {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project room: project-${projectId}`);
    }
  });

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

ioServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server running on port ${SOCKET_PORT}`);
});

app.set('io', io);