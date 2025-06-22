import express from "express";
import {
  createAdministrador,
  getAdministradorById,
  getAllAdministradores,
  updateAdministrador,
  deleteAdministrador
} from "../controllers/administradorController.js";
import { verificarToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/", createAdministrador);

router.get("/id/:id", getAdministradorById);
router.get("/all", getAllAdministradores);
router.put("/:id", verificarToken, updateAdministrador);
router.delete("/:id", verificarToken, deleteAdministrador);

export default router;