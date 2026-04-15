const socket = typeof io !== "undefined" ? io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
}) : null;

window.socket = socket;
window.joinProjectRoom = (projectId) => {
  if (socket && projectId) {
    socket.emit("join-project", projectId);
    console.log("Joined project room:", projectId);
  }
};

if (socket) {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
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
        }).showToast();
      } else if (typeof showToast === "function") {
        showToast(data.message, data.type);
      }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });
} else {
  console.warn("Socket.io library not loaded");
}
