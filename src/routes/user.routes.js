const router = require("express").Router();
const ctrl = require("../controllers/user.controller");

// Tất cả các thao tác với User đều yêu cầu đăng nhập
router.use(auth.verifyToken);
// All routes require authentication
router.get("/", ctrl.getAll);
// Thêm route lấy profile cá nhân cho người dùng đang đăng nhập
router.get("/profile", ctrl.getProfile);
router.get("/:id", ctrl.getOne);
router.put("/update-me", ctrl.update);
router.delete("/:id", auth.isAdmin, ctrl.remove); // Chỉ admin mới được xóa user

module.exports = router;