// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const userService = require("../services/userService");

// todas as rotas de /users exigem estar logado
router.use(requireAuth);

// listar staff do escritorio
router.get("/staff", requireRole(["ADMIN"]), userService.listStaff);

// criar funcionario (staff) — apenas ADMIN do escritorio
router.post("/staff", requireRole(["ADMIN"]), userService.createStaffUser);

module.exports = router;
