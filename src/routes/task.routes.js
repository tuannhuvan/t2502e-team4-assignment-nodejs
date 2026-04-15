const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth.verifyToken); // Tất cả các thao tác với Task đều yêu cầu đăng nhập
// All routes require authentication
router.post("/", ctrl.create);
router.get("/project/:projectId", ctrl.getByProject);
router.put("/:id", ctrl.update); // Cập nhật Task không yêu cầu phải là Owner, nhưng sẽ kiểm tra trong controller
router.delete("/:id", ctrl.remove);

module.exports = router;