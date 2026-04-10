const router = require("express").Router();
const ctrl = require("../controllers/project.controller");

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;