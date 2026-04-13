const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "info") {
  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");
  }, 2500);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

if (typeof io !== "undefined") {
  const socket = io();

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("TASK_UPDATED", data => {
    console.log("TASK_UPDATED:", data);
    showToast(data.message || "A task was updated", "info");
  });

  socket.on("COMMENT_ADDED", data => {
    console.log("COMMENT_ADDED:", data);
    showToast(data.message || "A new comment was added", "success");
  });

  socket.on("ASSIGNEE_CHANGED", data => {
    console.log("ASSIGNEE_CHANGED:", data);
    showToast(data.message || "Task assignee was changed", "warning");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
}
