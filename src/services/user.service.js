const User = require("../models/user");

exports.createUser = async (data) => {
  return await User.create(data);
};

exports.getUsers = async () => {
  return await User.find();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};