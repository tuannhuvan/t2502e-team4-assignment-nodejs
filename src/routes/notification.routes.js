const router = require("express").Router();
const ctrl = require("../controllers/notification.controller");

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/user/:userId", ctrl.getByUser);
router.put("/:id/read", ctrl.markRead);
router.delete("/:id", ctrl.remove);

module.exports = router;