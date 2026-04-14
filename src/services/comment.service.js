const Comment = require("../models/Comment");

exports.createComment = async (data) => {
  return await Comment.create({
    content: data.content,
    task: data.task,
    user: data.user
  });
};

exports.getByTask = async (taskId) => {
  return await Comment.find({ task: taskId }).populate("user", "fullName").lean();
};