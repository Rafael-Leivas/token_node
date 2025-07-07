import express from "express";
import { 
  loginUnificado,  // Remova o "as login"
  registerEmpresa as register,
  verificarToken,
  criarAdministrador,
  somenteEmpresa
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUnificado);  // Use loginUnificado diretamente

router.post("/administradores", verificarToken, somenteEmpresa, criarAdministrador);

export default router;