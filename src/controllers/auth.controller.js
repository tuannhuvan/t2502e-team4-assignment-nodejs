const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  await authService.register(req, res);
};

exports.login = async (req, res) => {
    await authService.login(req, res);
};

