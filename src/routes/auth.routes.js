const router = require("express").Router();
const authService = require("../services/auth.service");

router.get("/register", (req, res) => {
  res.redirect("/register");
});

router.get("/login", (req, res) => {
  res.redirect("/login");
});

router.post("/register", authService.register);
router.post("/login", authService.login);
router.post("/refresh", authService.refreshToken);
router.post("/logout", authService.logout);

module.exports = router;