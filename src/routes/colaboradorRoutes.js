import express from "express";
import {
  createColaborador,
  getColaboradorById,
  getAllColaboradores,
  updateColaborador,
  deleteColaborador,
  getCardsDoColaborador,
  vincularCards,
  desvincularCards,
  substituirCards
} from "../controllers/colaboradorController.js";
import { verificarToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/", createColaborador);

router.get("/id/:id", verificarToken, getColaboradorById);
router.get("/all", verificarToken, getAllColaboradores);
router.put("/:id", verificarToken, updateColaborador);
router.delete("/:id", deleteColaborador);
router.get("/:id/cards", verificarToken, getCardsDoColaborador);
router.post("/:id/cards/vincular", verificarToken, vincularCards);
router.post("/:id/cards/desvincular", verificarToken, desvincularCards);
router.put("/:id/cards", verificarToken, substituirCards);

export default router;