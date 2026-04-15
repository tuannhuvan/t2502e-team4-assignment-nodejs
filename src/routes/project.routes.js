const router = require("express").Router();
const ctrl = require("../controllers/project.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/", auth.verifyToken, ctrl.getAll);
router.put("/:id", auth.verifyToken, auth.isOwner, ctrl.update);
router.delete("/:id", auth.verifyToken, auth.isOwner, ctrl.remove);

module.exports = router;