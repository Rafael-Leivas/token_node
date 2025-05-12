import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import administradorRoutes from "./routes/administradorRoutes.js";
import colaboradorRoutes from "./routes/colaboradorRoutes.js";
import conteudoRoutes from "./routes/conteudoRoutes.js";

import db from "./database/mongoConfig.js";

const app = express();

app.use(cors());
app.use(express.json());

db.connect();

app.use("/auth", authRoutes);
app.use("/empresa", empresaRoutes);
app.use("/admin", administradorRoutes);
app.use("/colaborador", colaboradorRoutes);
app.use("/conteudo", conteudoRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "API em funcionamento"
  });
});

export default app;