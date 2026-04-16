const service = require("../services/user.service");

// Lấy danh sách tất cả người dùng
exports.getAll = async (req, res) => {
  try {
    const data = await service.getUsers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin chi tiết một người dùng (Dùng cho route /:id)
exports.getOne = async (req, res) => {
  try {
    const data = await service.getUserById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy profile của người dùng hiện tại (Dùng cho route /profile)
exports.getProfile = async (req, res) => {
  try {
    // userId được lấy từ middleware auth sau khi verify token
    const data = await service.getUserById(req.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân
exports.update = async (req, res) => {
  try {
    const data = await service.updateUser(req.userId, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa người dùng (Yêu cầu quyền Admin)
exports.remove = async (req, res) => {
  try {
    await service.deleteUser(req.params.id);
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tạo người dùng mới (Nếu cần cho admin)
exports.create = async (req, res) => {
  try {
    const data = await service.createUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};