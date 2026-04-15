const router = require("express").Router();
const ctrl = require("../controllers/activity.controller");
const auth = require("../middleware/auth.middleware");

// Tất cả các thao tác với Log đều yêu cầu dăng nhập
router.use(auth.verifyToken);
// All routes require authentication
router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/project/:projectId", ctrl.getProjectFeed);
router.get("/task/:taskId", ctrl.getByTask);
router.delete("/:id", ctrl.remove);

module.exports = router;