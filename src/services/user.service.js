const User = require("../models/User");

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
  return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};