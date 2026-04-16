const socket = typeof io !== "undefined" ? io(window.location.origin, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
}) : null;

if (socket) {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("notification", (data) => {
    if (typeof showToast === "function") {
      showToast(data.message, data.type || "info");
    }

    if (data.entityType === 'task' && typeof refreshTaskList === 'function') {
      refreshTaskList();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket error:", error);
  });
}