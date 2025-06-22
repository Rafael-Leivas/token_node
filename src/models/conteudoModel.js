import mongoose from "mongoose";

const ConteudoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    default: 'DOCUMENTOS_IMPORTANTES'
  },
  setor: {
    type: String
  },
  corpo: {
    type: String
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  id_administrador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrador',
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Conteudo", ConteudoSchema);