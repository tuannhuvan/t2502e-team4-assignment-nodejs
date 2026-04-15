const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Cấu hình các tùy chọn kết nối để tăng tính ổn định
    const connectionOptions = {
      autoIndex: true, // Tự động tạo index từ Schema để tăng tốc truy vấn
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    console.log(`---`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`---`);

  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    // Thoát tiến trình với mã lỗi 1 nếu không thể kết nối DB
    process.exit(1); 
  }
};

/**
 * Lắng nghe các sự kiện của kết nối (Dùng cho việc giám sát lỗi realtime)
 */
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️ MongoDB error: ${err}`);
});

/**
 * Đảm bảo đóng kết nối DB khi ứng dụng Node.js bị tắt (Tránh rò rỉ kết nối)
 */
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;