const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/project/:projectId", auth.verifyToken, ctrl.getByProject);
router.put("/:id", auth.verifyToken, ctrl.update);
router.delete("/:id", auth.verifyToken, ctrl.remove);

module.exports = router;