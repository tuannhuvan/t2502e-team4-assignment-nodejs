const router = require("express").Router();
const ctrl = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/", auth.verifyToken, ctrl.getAll);
router.get("/user/:userId", auth.verifyToken, ctrl.getByUser);
router.put("/:id/read", auth.verifyToken, ctrl.markRead);
router.delete("/:id", auth.verifyToken, ctrl.remove);

module.exports = router;