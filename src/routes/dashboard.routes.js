const router = require("express").Router();
const dashboardController = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", dashboardController.showLanding);
router.get("/login", dashboardController.showLogin);
router.get("/register", dashboardController.showRegister);

// SỬA: Sử dụng ensureAuthenticated để chuyển hướng về /login nếu chưa đăng nhập
router.get("/dashboard", auth.ensureAuthenticated, dashboardController.showDashboard);

module.exports = router;