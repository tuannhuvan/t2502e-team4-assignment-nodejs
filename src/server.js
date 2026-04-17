require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const notificationSocket = require('./sockets/index');

// Kết nối Database
connectDB();

const EXPRESS_PORT = process.env.PORT || 3000;

// Express server
const expressServer = http.createServer(app);
expressServer.listen(EXPRESS_PORT, () => {
  console.log(`Express server running on port http://localhost:${EXPRESS_PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

notificationSocket.setIo(io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-project", (projectId) => {
    if (projectId) {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project room: project-${projectId}`);
    }
  });

    socket.on("join-user", (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`User ${socket.id} joined user room: user-${userId}`);
      }
    });

});

app.set('io', io);