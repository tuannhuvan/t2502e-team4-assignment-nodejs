var socket = window.socket || (typeof io !== "undefined" ? io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
}) : null);

window.socket = socket;
window.joinProjectRoom = (projectId) => {
  if (window.socket && projectId) {
    window.socket.emit("join-project", projectId);
    console.log("Joined project room:", projectId);
  }
};

window.joinUserRoom = (userId) => {
  if (socket && userId) {
    socket.emit("join-user", userId);
    console.log("Joined user room:", userId);
  }
};

if (socket) {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    if (window.currentUserId) {
      window.joinUserRoom(window.currentUserId);
    }
  });

  // Listen for the ONLY event the backend sends
  socket.on("notification", (data) => {
      console.log("Notification received:", data);
      // data contains: title, message, type, entityType
      if (typeof Toastify !== "undefined") {
        Toastify({
          text: `${data.title}: ${data.message}`,
          duration: 5000,
          close: true,
          gravity: "top", // top or bottom
          position: "right", // left, center or right
          backgroundColor: data.type === "success" ? "green" : data.type === "warning" ? "orange" : data.type === "error" ? "red" : "blue",
          stopOnFocus: true, // Ngừng đếm ngược khi di chuột vào
          destination: data.link || undefined,
          newWindow: true
        }).showToast();
      } else if (typeof showToast === "function") {
        showToast(data.message, data.type);
      }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, "reason:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("Socket reconnect attempt:", attempt);
  });

  socket.on("reconnect_failed", () => {
    console.error("Socket reconnect failed");
  });
} else {
  console.warn("Socket.io library not loaded");
}
