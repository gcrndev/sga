const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { requireAuth } = require("../middleware/auth");

// login
router.post("/login", authService.login);

router.post("/register-firm", authService.registerFirm);

router.post("/complete-invite", authService.completeInvite);

router.get("/me", requireAuth, authService.me);

module.exports = router;
