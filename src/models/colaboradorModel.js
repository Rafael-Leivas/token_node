import mongoose from "mongoose";

const ColaboradorSchema = new mongoose.Schema({
  nome_completo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  setor: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: false
  },
  data_nascimento: {
    type: Date,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  id_administrador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrador',
    required: true
  },
  cards_vinculados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conteudo'
  }]
}, { timestamps: true });

export default mongoose.model("Colaborador", ColaboradorSchema);