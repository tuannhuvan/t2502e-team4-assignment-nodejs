const router = require("express").Router();
const ctrl = require("../controllers/activity.controller");

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/task/:taskId", ctrl.getByTask);
router.delete("/:id", ctrl.remove);

module.exports = router;