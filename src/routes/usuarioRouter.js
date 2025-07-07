import express from "express";
const router = express.Router();

import controller from "../controllers/usuarioControllers.js";
import authControllers, { loginUsuario } from "../controllers/authController.js";

router.get("/", authControllers.verificarToken, controller.getAll);
router.post("/criar", controller.criarUsuario);
router.get("/teste", async (req, res) => {
    return res.json({
        msg: "teste realizado"
    })
})
router.post("/login", loginUsuario)
router.get("/rotaAutenticada", authControllers.verificarToken, controller.rotaAutenticada)

export default router;

// LOGIN DE USUÁRIO
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se usuário existe
    const usuario = await usuarioSchema.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciais inválidas"
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciais inválidas"
      });
    }

    // Gerar token
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        role: 'usuario'
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      statusCode: 200,
      message: "Login realizado com sucesso!",
      data: {
        token,
        usuario: {
          id: usuario._id,
          name: usuario.name,
          email: usuario.email
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};