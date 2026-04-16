const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/activity.controller");
const auth = require("../middleware/auth.middleware");

// Tất cả các thao tác với Log đều yêu cầu đăng nhập
router.use(auth.verifyToken);

router.post("/", ctrl.create);
router.get("/", ctrl.getAllActivities); // Khớp với tên hàm trong controller
router.get("/project/:projectId", ctrl.getProjectFeed);
router.delete("/:id", ctrl.remove);

module.exports = router;