const router = require("express").Router();
const pageController = require("../controllers/page.controller");

router.get("/task/create", pageController.showTaskCreate);
router.get("/task/:taskId", pageController.showTaskDetail);
router.get("/task/:taskId/edit", pageController.showTaskEdit);
router.get("/task/:taskId/delete", pageController.showTaskDelete);

module.exports = router;
