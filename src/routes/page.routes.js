const router = require("express").Router();
const pageController = require("../controllers/page.controller");
const auth = require("../middleware/auth.middleware");

// Route hiển thị trang tạo Task mới (Cần đổ dữ liệu Project và User vào Select box)
router.get("/task/create", auth.ensureAuthenticated, pageController.showTaskCreate);

// Route hiển thị trang danh sách Project
router.get("/projects", auth.ensureAuthenticated, pageController.showProjectList);

// Route hiển thị trang tạo Project mới
router.get("/project/create", auth.ensureAuthenticated, pageController.showProjectCreate);

// Route hiển thị chi tiết một Task (Bao gồm thông tin mô tả, người thực hiện)
router.get("/task/:taskId", auth.ensureAuthenticated, pageController.showTaskDetail);

// Route hiển thị trang chỉnh sửa Task
router.get("/task/:taskId/edit", auth.ensureAuthenticated, pageController.showTaskEdit);

// Route xác nhận xóa Task (Để đảm bảo trải nghiệm người dùng không bị xóa nhầm)
router.get("/task/:taskId/delete", auth.ensureAuthenticated, pageController.showTaskDelete);

module.exports = router;