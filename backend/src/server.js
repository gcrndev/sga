require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

// Honor reverse proxy headers (needed for accurate rate limiting behind Render/NGINX)
app.set("trust proxy", process.env.TRUST_PROXY || 1);

// middlewares globais
app.use(cors());
app.use(express.json());

// rate limit basico para rotas de auth
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// rotas
app.use("/auth", authLimiter, authRoutes);
app.use("/clients", clientRoutes);
app.use("/users", userRoutes);
app.use("/public", publicFormLimiter, publicRoutes);

// rota simples de teste
app.get("/", (req, res) => {
  res.json({ status: "SGA API rodando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
