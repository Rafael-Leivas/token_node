import Conteudo from "../models/conteudoModel.js";
import Colaborador from "../models/colaboradorModel.js";

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

export const getConteudosByColaborador = async (req, res) => {
  try {
    const { userid } = req.params;

    const colaborador = await Colaborador.findById(userid)
      .populate({
        path: 'cards_vinculados',
        populate: {
          path: 'id_administrador',
          select: 'nome_completo email'
        }
      });

    if (!colaborador) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    const conteudosDisponiveis = colaborador.cards_vinculados;

    res.status(200).json({
      statusCode: 200,
      message: "Conteúdos do colaborador encontrados com sucesso!",
      data: {
        colaborador: {
          id: colaborador._id,
          nome_completo: colaborador.nome_completo,
          email: colaborador.email,
          setor: colaborador.setor,
          cargo: colaborador.cargo
        },
        conteudos: conteudosDisponiveis,
        total: conteudosDisponiveis.length
      }
    });

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};