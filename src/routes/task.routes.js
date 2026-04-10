const router = require("express").Router();
const ctrl = require("../controllers/task.controller");

router.post("/", ctrl.create);
router.get("/project/:projectId", ctrl.getByProject);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;