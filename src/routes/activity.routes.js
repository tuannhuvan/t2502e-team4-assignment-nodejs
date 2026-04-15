const router = require("express").Router();
const ctrl = require("../controllers/activity.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/", auth.verifyToken, ctrl.getAll);
router.get("/task/:taskId", auth.verifyToken, ctrl.getByTask);
router.delete("/:id", auth.verifyToken, ctrl.remove);

module.exports = router;