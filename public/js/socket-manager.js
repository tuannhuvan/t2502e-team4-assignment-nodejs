// Khởi tạo socket
const socket = typeof io !== "undefined" ? io(window.location.origin, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
}) : null;

if (socket) {
  socket.on("connect", () => {
    console.log("Socket.io đã kết nối:", socket.id);
  });

  // Lắng nghe sự kiện thông báo từ phía Backend
  socket.on("notification", (data) => {
    console.log("Thông báo mới:", data);
    
    // data: { message, type, entityType }
    if (typeof showToast === "function") {
      showToast(data.message, data.type || "info");
    }

    // Nếu có thay đổi liên quan đến task, làm mới giao diện nếu cần
    if (data.entityType === 'task' && typeof refreshTaskList === 'function') {
      // Bạn có thể thêm logic kiểm tra xem người dùng có đang ở trang dashboard không
      if (window.location.pathname === '/dashboard') {
        refreshTaskList();
      }
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Lỗi kết nối Socket:", error);
  });
} else {
  console.warn("Thư viện Socket.io chưa được tải.");
}