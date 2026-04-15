const router = require("express").Router();
const ctrl = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth.verifyToken); // Tất cả các thao tác với Notification đều yêu cầu đăng nhập
// All routes require authentication
router.post("/", ctrl.create);
router.get("/all", ctrl.getAll);
router.get("/", ctrl.getByUser);
router.put("/:id/read", ctrl.markRead);
router.delete("/:id", ctrl.remove);

module.exports = router;