const express = require("express");
const router = express.Router();
const publicFormService = require("../services/publicFormService");

// rota publica para intake de cliente final por slug de escritorio
router.post("/forms/:slug/clients", publicFormService.submitClientForm);

module.exports = router;
