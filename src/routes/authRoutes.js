import express from "express";
import { 
  loginEmpresa as login,
  registerEmpresa as register,
  verificarToken,
  criarAdministrador,
  somenteEmpresa
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/administradores", verificarToken, somenteEmpresa, criarAdministrador);

export default router;