import express from "express";
import { 
  registerEmpresa, 
  loginEmpresa,
  criarAdministrador
} from "../controllers/authController.js";
import { verificarToken, somenteEmpresa } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerEmpresa);
router.post("/login", loginEmpresa);

router.post("/administradores", verificarToken, somenteEmpresa, criarAdministrador);

export default router;