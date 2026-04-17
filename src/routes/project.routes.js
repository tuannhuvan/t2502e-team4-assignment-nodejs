const router = require("express").Router();
const ctrl = require("../controllers/project.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/", auth.verifyToken, ctrl.getAll);
router.post("/:id/invite", auth.verifyToken, auth.isProjectAdmin, ctrl.inviteMember);
router.put("/:id/invite/accept", auth.verifyToken, ctrl.acceptInvite);
router.put("/:id/invite/reject", auth.verifyToken, ctrl.rejectInvite);
router.delete("/:id/invite/cancel", auth.verifyToken, auth.isProjectAdmin, ctrl.cancelInvite);
router.put("/:id", auth.verifyToken, auth.isProjectAdmin, ctrl.update);
router.delete("/:id", auth.verifyToken, auth.isProjectOwner, ctrl.remove);

module.exports = router;