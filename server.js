require('dotenv').config();
const http = require('http');
const app = require('./src/app'); // Đảm bảo đường dẫn tới app.js chính xác
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/sockets/index');

// 1. KẾT NỐI DATABASE
connectDB();

const PORT = process.env.PORT || 3000;

// 2. KHỞI TẠO HTTP SERVER TỪ EXPRESS APP
const server = http.createServer(app);

// 3. KHỞI TẠO SOCKET.IO
// initSocket sẽ nhận server và trả về instance io
const io = initSocket(server);

// 4. CHIA SẺ IO TOÀN CỤC (Để sử dụng trong các Controller qua req.app.get('io'))
app.set('io', io);

// 5. LẮNG NGHE CỔNG
server.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 Server đang chạy trên cổng: http://localhost:${PORT}
  Mode: ${process.env.NODE_ENV || 'development'}
  Static files: /public
  Views: /src/views
  ==========================================
  `);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Set a different PORT or stop the process using it.`);
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});