import express from "express";
import {
  createColaborador,
  getColaboradorById,
  getAllColaboradores,
  updateColaborador,
  deleteColaborador,
  getCardsDoColaborador
} from "../controllers/colaboradorController.js";
import { verificarToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/", createColaborador);

router.get("/id/:id", verificarToken, getColaboradorById);
router.get("/all", verificarToken, getAllColaboradores);
router.put("/:id", verificarToken, updateColaborador);
router.delete("/:id", verificarToken, deleteColaborador);
router.get("/:id/cards", verificarToken, getCardsDoColaborador);

export default router;