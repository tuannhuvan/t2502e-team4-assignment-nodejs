const router = require("express").Router();
const ctrl = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/:taskId", auth.verifyToken, ctrl.getByTask);

module.exports = router;