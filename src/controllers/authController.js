import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Empresa from "../models/empresaModel.js";
import Administrador from "../models/administradorModel.js";
import Colaborador from "../models/colaboradorModel.js";

dotenv.config();
const SECRET = process.env.SECRET || 'seuSegredoSuperSecreto';

// CADASTRO DA EMPRESA (sua conta master)
export const registerEmpresa = async (req, res) => {
  try {
    const { nome, email, senha, cnpj } = req.body;

    // Verificar se empresa já existe
    const empresaExistente = await Empresa.findOne({ $or: [{ email }, { cnpj }] });
    if (empresaExistente) {
      return res.status(400).json({
        statusCode: 400,
        message: "Empresa já cadastrada com este e-mail ou CNPJ"
      });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar nova empresa
    const novaEmpresa = new Empresa({
      nome,
      email,
      senha: senhaHash,
      cnpj
    });

    const empresaSalva = await novaEmpresa.save();

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: empresaSalva._id,
        email: empresaSalva.email,
        role: 'empresa'
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      statusCode: 201,
      message: "Empresa registrada com sucesso!",
      data: {
        token,
        empresa: {
          id: empresaSalva._id,
          nome: empresaSalva.nome,
          email: empresaSalva.email
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

// LOGIN DA EMPRESA
export const loginEmpresa = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se empresa existe
    const empresa = await Empresa.findOne({ email });
    if (!empresa) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciais inválidas"
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    if (!senhaValida) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciais inválidas"
      });
    }

    // Gerar token
    const token = jwt.sign(
      {
        id: empresa._id,
        email: empresa.email,
        role: 'empresa'
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      statusCode: 200,
      message: "Login realizado com sucesso!",
      data: {
        token,
        empresa: {
          id: empresa._id,
          nome: empresa.nome,
          email: empresa.email
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

// LOGIN UNIFICADO
export const loginUnificado = async (req, res) => {
  try {
    const { email, senha } = req.body;
    let usuario = null;
    let tipoUsuario = null;

    // Verificar se é Empresa
    usuario = await Empresa.findOne({ email });
    if (usuario) {
      tipoUsuario = 'empresa';
    }

    // Verificar se é Administrador
    if (!usuario) {
      usuario = await Administrador.findOne({ email });
      if (usuario) {
        tipoUsuario = 'administrador';
      }
    }

    // Verificar se é Colaborador
    if (!usuario) {
      usuario = await Colaborador.findOne({ email });
      if (usuario) {
        tipoUsuario = 'colaborador';
      }
    }

    if (!usuario) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciais inválidas"
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
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
        role: tipoUsuario
      },
      SECRET,
      { expiresIn: '1h' }
    );

    // Estrutura de resposta corrigida
    const responseData = {
      token,
      tipoUsuario  // ESTE CAMPO ESTAVA SENDO DEFINIDO MAS NÃO RETORNADO CORRETAMENTE
    };

    // Adicionar dados específicos do tipo de usuário
    if (tipoUsuario === 'empresa') {
      responseData.empresa = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      };
    } else if (tipoUsuario === 'administrador') {
      responseData.administrador = {
        id: usuario._id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        isAdmin: usuario.isAdmin
      };
    } else if (tipoUsuario === 'colaborador') {
      responseData.colaborador = {
        id: usuario._id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        setor: usuario.setor,
        cargo: usuario.cargo
      };
    }

    res.status(200).json({
      statusCode: 200,
      message: "Login realizado com sucesso!",
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

// CRIAÇÃO DE ADMINISTRADOR PELA EMPRESA
export const criarAdministrador = async (req, res) => {
  try {
    // Apenas empresas autenticadas podem criar administradores
    if (req.user.role !== 'empresa') {
      return res.status(403).json({
        statusCode: 403,
        message: "Acesso não autorizado"
      });
    }

    const { nome_completo, email, senha } = req.body;

    // Verificar se email já está em uso
    const adminExistente = await Administrador.findOne({ email });
    if (adminExistente) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email já cadastrado"
      });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar novo administrador vinculado à empresa
    const novoAdmin = new Administrador({
      nome_completo,
      email,
      senha: senhaHash,
      empresa: req.user.id, // ID da empresa do token JWT
      isAdmin: true
    });

    const adminSalvo = await novoAdmin.save();

    res.status(201).json({
      statusCode: 201,
      message: "Administrador criado com sucesso!",
      data: {
        id: adminSalvo._id,
        nome: adminSalvo.nome_completo,
        email: adminSalvo.email
      }
    });

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

// MIDDLEWARE DE AUTENTICAÇÃO
export const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Token não fornecido"
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Adiciona user à requisição
    next();
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      message: "Token inválido ou expirado"
    });
  }
};

// MIDDLEWARE DE AUTORIZAÇÃO (apenas para empresas)
export const somenteEmpresa = (req, res, next) => {
  if (req.user.role !== 'empresa') {
    return res.status(403).json({
      statusCode: 403,
      message: "Acesso restrito a empresas"
    });
  }
  next();
};

export default {
  registerEmpresa,
  loginEmpresa,
  loginUnificado,
  criarAdministrador,
  verificarToken,
  somenteEmpresa
};