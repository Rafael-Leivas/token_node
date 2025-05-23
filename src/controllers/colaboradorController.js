import Colaborador from "../models/colaboradorModel.js";
import bcrypt from 'bcrypt';

export const createColaborador = async (req, res) => {
  try {
    const { email } = req.body;
    const existingColab = await Colaborador.findOne({ email });
    
    if (existingColab) {
      return res.status(400).json({
        statusCode: 400,
        message: "Já existe um Colaborador com esse e-mail!"
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.senha, 10);
    const novoColab = new Colaborador({
      ...req.body,
      senha: hashedPassword
    });

    const colabSalvo = await novoColab.save();
    
    res.status(201).json({
      statusCode: 201,
      message: "Colaborador criado com sucesso!",
      data: colabSalvo
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getColaboradorById = async (req, res) => {
  try {
    const colaborador = await Colaborador.findById(req.params.id).populate('id_administrador');
    if (!colaborador) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }
    res.status(200).json({
      statusCode: 200,
      data: colaborador
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getAllColaboradores = async (req, res) => {
  try {
    const colaboradores = await Colaborador.find().populate('id_administrador');
    res.status(200).json({
      statusCode: 200,
      data: colaboradores
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const updateColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.senha) {
      updates.senha = bcrypt.hashSync(updates.senha, 10);
    }

    const colabAtualizado = await Colaborador.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('id_administrador');

    if (!colabAtualizado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Colaborador atualizado com sucesso!",
      data: colabAtualizado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const deleteColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    
    const colabDeletado = await Colaborador.findByIdAndDelete(id);
    
    if (!colabDeletado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Colaborador removido com sucesso!",
      data: colabDeletado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};