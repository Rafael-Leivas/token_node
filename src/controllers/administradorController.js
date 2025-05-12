import Administrador from "../models/administradorModel.js";
import bcrypt from 'bcrypt';

export const createAdministrador = async (req, res) => {
  try {
    const { email } = req.body;
    const existingAdmin = await Administrador.findOne({ email });
    
    if (existingAdmin) {
      return res.status(400).json({
        statusCode: 400,
        message: "Já existe um Administrador com esse e-mail!"
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.senha, 10);
    const novoAdmin = new Administrador({
      ...req.body,
      senha: hashedPassword
    });

    const adminSalvo = await novoAdmin.save();
    
    res.status(201).json({
      statusCode: 201,
      message: "Administrador criado com sucesso!",
      data: adminSalvo
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getAdministradorById = async (req, res) => {
  try {
    const admin = await Administrador.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        message: "Administrador não encontrado"
      });
    }
    res.status(200).json({
      statusCode: 200,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getAllAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json({
      statusCode: 200,
      data: administradores
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.senha) {
      updates.senha = bcrypt.hashSync(updates.senha, 10);
    }

    const adminAtualizado = await Administrador.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!adminAtualizado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Administrador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Administrador atualizado com sucesso!",
      data: adminAtualizado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    
    const adminDeletado = await Administrador.findByIdAndDelete(id);
    
    if (!adminDeletado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Administrador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Administrador removido com sucesso!",
      data: adminDeletado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};