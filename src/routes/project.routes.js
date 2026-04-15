const router = require("express").Router();
const ctrl = require("../controllers/project.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth.verifyToken); // Tất cả các thao tác với Project đều yêu cầu đăng nhập
// All routes require authentication
router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
// Chỉ chủ sở hữu (Owner) mới có quyền sửa hoặc xóa dự án
router.put("/:id", auth.isOwner, ctrl.update);
router.delete("/:id", auth.isOwner, ctrl.remove);

module.exports = router;