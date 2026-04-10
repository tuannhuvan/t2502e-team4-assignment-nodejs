const router = require("express").Router();
const ctrl = require("../controllers/comment.controller");

router.post("/", ctrl.create);
router.get("/:taskId", ctrl.getByTask);

module.exports = router;