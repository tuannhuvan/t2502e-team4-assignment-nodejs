const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
// Tất cả các thao tác với User đều yêu cầu đăng nhập
router.use(auth.verifyToken);
// Lấy danh sách user
router.get("/", ctrl.getAll);
// Lấy profile cá nhân (Đặt trước route /:id để tránh bị hiểu nhầm 'profile' là một 'id')
router.get("/profile", ctrl.getProfile);
// Lấy thông tin chi tiết user theo ID
router.get("/:id", ctrl.getOne);
// Cập nhật thông tin bản thân
router.put("/update-me", ctrl.update);
// Xóa user (Chỉ Admin mới có quyền này)
router.delete("/:id", auth.isAdmin, ctrl.remove); // Chỉ admin mới được xóa user

module.exports = router;