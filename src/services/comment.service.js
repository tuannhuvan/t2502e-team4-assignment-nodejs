const Comment = require("../models/Comment");

exports.createComment = async (data) => {
  return await Comment.create({
    content: data.content,
    task: data.task
  });
};

exports.getByTask = async (taskId) => {
  return await Comment.find({ task: taskId });
};