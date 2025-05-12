import Conteudo from "../models/conteudoModel.js";

export const createConteudo = async (req, res) => {
  try {
    const novoConteudo = new Conteudo(req.body);
    const conteudoSalvo = await novoConteudo.save();
    
    res.status(201).json({
      statusCode: 201,
      message: "Conteúdo criado com sucesso!",
      data: conteudoSalvo
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getConteudoById = async (req, res) => {
  try {
    const conteudo = await Conteudo.findById(req.params.id).populate('id_administrador');
    if (!conteudo) {
      return res.status(404).json({
        statusCode: 404,
        message: "Conteúdo não encontrado"
      });
    }
    res.status(200).json({
      statusCode: 200,
      data: conteudo
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const getAllConteudos = async (req, res) => {
  try {
    const conteudos = await Conteudo.find().populate('id_administrador');
    res.status(200).json({
      statusCode: 200,
      data: conteudos
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const updateConteudo = async (req, res) => {
  try {
    const { id } = req.params;
    const conteudoAtualizado = await Conteudo.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate('id_administrador');

    if (!conteudoAtualizado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Conteúdo não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Conteúdo atualizado com sucesso!",
      data: conteudoAtualizado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

export const deleteConteudo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conteudoDeletado = await Conteudo.findByIdAndDelete(id);
    
    if (!conteudoDeletado) {
      return res.status(404).json({
        statusCode: 404,
        message: "Conteúdo não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Conteúdo removido com sucesso!",
      data: conteudoDeletado
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};