const Task = require("../models/Task");

exports.createTask = async (data) => {
  return await Task.create(data);
};

exports.getTasksByProject = async (projectId) => {
  return await Task.find({ projectId })
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email");
};

exports.getTaskById = async (id) => {
  return await Task.findById(id)
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email")
    .lean();
};

exports.updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email");
};

exports.deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

exports.inviteMember = async (taskId, userId, invitedBy) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  const already = task.members.find(member => member.user?.toString() === userId.toString());
  if (already) return task;

  task.members.push({ user: userId, status: "pending", invitedBy });
  return await task.save();
};

exports.acceptTaskInvite = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  const member = task.members.find(member => member.user?.toString() === userId.toString());
  if (!member) return null;

  member.status = "accepted";
  return await task.save();
};

exports.addAttachment = async (taskId, attachment) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $push: { attachments: attachment } },
    { returnDocument: 'after' }
  )
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email");
};

exports.removeAttachment = async (taskId, attachmentId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $pull: { attachments: { _id: attachmentId } } },
    { returnDocument: 'after' }
  )
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email");
};

exports.addTag = async (taskId, tag) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $addToSet: { tags: tag } },
    { returnDocument: 'after' }
  )
    .populate("assignee", "fullName")
    .populate("members.user", "fullName email");
};