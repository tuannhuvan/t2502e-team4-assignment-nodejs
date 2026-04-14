const socket = typeof io !== "undefined" ? io(process.env.SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
}) : null;

if (socket) {
  // Listen for the ONLY event the backend sends
  socket.on("notification", (data) => {
      // data contains: title, message, type, entityType
      if (typeof showToast === "function") {
        showToast(data.message, data.type);
      }

      // Synchronize UI: if a task was updated and we are on the task page, refresh the list
      if (data.entityType === 'task' && typeof refreshTaskList === 'function') {
          refreshTaskList();
      }
  });
}
