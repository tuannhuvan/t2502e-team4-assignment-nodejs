const socket = io();

// test kết nối
socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id);
});

// ============================
// 🔥 Lắng nghe task update
// ============================
socket.on("TASK_UPDATED", (task) => {
  console.log("📌 Task updated:", task);
  showToast(`Task "${task.title}" updated`);
});

// ============================
// 💬 Comment mới
// ============================
socket.on("NEW_COMMENT", (data) => {
  console.log("💬 New comment:", data);
  showToast(`New comment on "${data.taskTitle}"`);
});

// ============================
// 👤 Assign task
// ============================
socket.on("TASK_ASSIGNED", (data) => {
  console.log("👤 Assigned:", data);
  showToast(`You were assigned: "${data.title}"`);
});

// ============================
// 🔔 Toast function
// ============================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}