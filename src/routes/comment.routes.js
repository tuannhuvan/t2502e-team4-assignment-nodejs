const router = require("express").Router();
const ctrl = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth.verifyToken); // Tất cả các thao tác với Comment đều yêu cầu đăng nhập
// All routes require authentication
router.post("/", ctrl.create);
router.get("/:taskId", ctrl.getByTask); // Lấy tất cả comment liên quan đến task

module.exports = router;