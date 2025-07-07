import Colaborador from "../models/colaboradorModel.js";
import Conteudo from "../models/conteudoModel.js";
import bcrypt from 'bcrypt';

export const createColaborador = async (req, res) => {
  try {
    const { email, cards_vinculados = [] } = req.body;
    const existingColab = await Colaborador.findOne({ email });
    if (existingColab) {
      return res.status(400).json({
        statusCode: 400,
        message: "Já existe um Colaborador com esse e-mail!"
      });
    }

    // Validação dos cards_vinculados
    if (cards_vinculados.length > 0) {
      const count = await Conteudo.countDocuments({ _id: { $in: cards_vinculados } });
      if (count !== cards_vinculados.length) {
        return res.status(400).json({
          statusCode: 400,
          message: "Um ou mais cards_vinculados não existem."
        });
      }
    }

    const hashedPassword = bcrypt.hashSync(req.body.senha, 10);
    const novoColab = new Colaborador({
      ...req.body,
      senha: hashedPassword,
      cards_vinculados
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

export const getCardsDoColaborador = async (req, res) => {
  try {
    const colaborador = await Colaborador.findById(req.params.id)
      .populate('cards_vinculados');
    if (!colaborador) {
      return res.status(404).json({ message: "Colaborador não encontrado" });
    }
    res.status(200).json({
      statusCode: 200,
      cards: colaborador.cards_vinculados
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VINCULAR CARDS A UM COLABORADOR
export const vincularCards = async (req, res) => {
  try {
    const { id } = req.params;
    const { cards_vinculados } = req.body;

    if (!cards_vinculados || !Array.isArray(cards_vinculados)) {
      return res.status(400).json({
        statusCode: 400,
        message: "cards_vinculados deve ser um array"
      });
    }

    // Validar se os cards existem
    if (cards_vinculados.length > 0) {
      const count = await Conteudo.countDocuments({ _id: { $in: cards_vinculados } });
      if (count !== cards_vinculados.length) {
        return res.status(400).json({
          statusCode: 400,
          message: "Um ou mais cards não existem."
        });
      }
    }

    // Atualizar colaborador adicionando os novos cards (sem duplicar)
    const colaborador = await Colaborador.findByIdAndUpdate(
      id,
      { $addToSet: { cards_vinculados: { $each: cards_vinculados } } },
      { new: true }
    ).populate('cards_vinculados');

    if (!colaborador) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Cards vinculados com sucesso!",
      data: colaborador
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

// DESVINCULAR CARDS DE UM COLABORADOR
export const desvincularCards = async (req, res) => {
  try {
    const { id } = req.params;
    const { cards_vinculados } = req.body;

    if (!cards_vinculados || !Array.isArray(cards_vinculados)) {
      return res.status(400).json({
        statusCode: 400,
        message: "cards_vinculados deve ser um array"
      });
    }

    // Remover cards do colaborador
    const colaborador = await Colaborador.findByIdAndUpdate(
      id,
      { $pull: { cards_vinculados: { $in: cards_vinculados } } },
      { new: true }
    ).populate('cards_vinculados');

    if (!colaborador) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Cards desvinculados com sucesso!",
      data: colaborador
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};

// SUBSTITUIR TODOS OS CARDS DE UM COLABORADOR
export const substituirCards = async (req, res) => {
  try {
    const { id } = req.params;
    const { cards_vinculados } = req.body;

    if (!Array.isArray(cards_vinculados)) {
      return res.status(400).json({
        statusCode: 400,
        message: "cards_vinculados deve ser um array"
      });
    }

    // Validar se os cards existem
    if (cards_vinculados.length > 0) {
      const count = await Conteudo.countDocuments({ _id: { $in: cards_vinculados } });
      if (count !== cards_vinculados.length) {
        return res.status(400).json({
          statusCode: 400,
          message: "Um ou mais cards não existem."
        });
      }
    }

    // Substituir todos os cards
    const colaborador = await Colaborador.findByIdAndUpdate(
      id,
      { cards_vinculados },
      { new: true }
    ).populate('cards_vinculados');

    if (!colaborador) {
      return res.status(404).json({
        statusCode: 404,
        message: "Colaborador não encontrado"
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Cards atualizados com sucesso!",
      data: colaborador
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
};