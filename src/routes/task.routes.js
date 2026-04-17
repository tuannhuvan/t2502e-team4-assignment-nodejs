const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.post("/", auth.verifyToken, ctrl.create);
router.get("/project/:projectId", auth.verifyToken, ctrl.getByProject);
router.put("/:id", auth.verifyToken, ctrl.update);
router.delete("/:id", auth.verifyToken, ctrl.remove);
router.post("/:id/invite", auth.verifyToken, ctrl.inviteMember);
router.put("/:id/invite/accept", auth.verifyToken, ctrl.acceptInvite);
router.post("/:id/attachments", auth.verifyToken, ctrl.addAttachment);
router.delete("/:id/attachments/:attachmentId", auth.verifyToken, ctrl.removeAttachment);
router.post("/:id/tags", auth.verifyToken, ctrl.addTag);

module.exports = router;