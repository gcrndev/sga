// src/routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const clientService = require("../services/clientService");

// todas as rotas de cliente exigem estar logado
router.use(requireAuth);

// listar clientes - ADMIN, ADVOGADO, ADMINISTRATIVO, FINANCEIRO
router.get(
  "/",
  requireRole(["ADMIN", "ADVOGADO", "ADMINISTRATIVO", "FINANCEIRO"]),
  clientService.listClients
);

// criar cliente - ADMIN, ADMINISTRATIVO
router.post(
  "/",
  requireRole(["ADMIN", "ADMINISTRATIVO"]),
  clientService.createClient
);

// atualizar status de cliente - ADMIN, ADMINISTRATIVO
router.patch(
  "/:id/status",
  requireRole(["ADMIN", "ADMINISTRATIVO"]),
  clientService.updateStatus
);

module.exports = router;
