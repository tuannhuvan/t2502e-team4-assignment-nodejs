const router = require("express").Router();
const pageController = require("../controllers/page.controller");
const auth = require("../middleware/auth.middleware");

router.get("/task/create", auth.ensureAuthenticated, pageController.showTaskCreate);
router.get("/project/create", auth.ensureAuthenticated, pageController.showProjectCreate);
router.get("/task/:taskId", auth.ensureAuthenticated, pageController.showTaskDetail);
router.get("/task/:taskId/edit", auth.ensureAuthenticated, pageController.showTaskEdit);
router.get("/task/:taskId/delete", auth.ensureAuthenticated, pageController.showTaskDelete);

module.exports = router;
