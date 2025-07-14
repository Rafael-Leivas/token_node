import express from "express";
import {
  createConteudo,
  getConteudoById,
  getAllConteudos,
  updateConteudo,
  deleteConteudo,
  getConteudosByColaborador
} from "../controllers/conteudoController.js";
import { verificarToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/", verificarToken, createConteudo);
router.get("/id/:id", verificarToken, getConteudoById);
router.get("/all", getAllConteudos);
router.get("/colaborador/:userid", getConteudosByColaborador);
router.put("/:id", verificarToken, updateConteudo);
router.delete("/:id", deleteConteudo);

export default router;