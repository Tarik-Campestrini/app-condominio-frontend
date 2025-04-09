import { CheckCircle, AlertCircle, Info } from "lucide-react";
import React from "react";

const tipoConfig = {
  sucesso: {
    icon: <CheckCircle className="text-green-500 w-8 h-8" />,
    corBotao: "bg-green-500 hover:bg-green-600",
    textoBotao: "Salvar",
  },
  erro: {
    icon: <AlertCircle className="text-red-500 w-8 h-8" />,
    corBotao: "bg-red-500 hover:bg-red-600",
    textoBotao: "Deletar",
  },
  info: {
    icon: <Info className="text-blue-500 w-8 h-8" />,
    corBotao: "bg-blue-500 hover:bg-blue-600",
    textoBotao: "Atualizar",
  },
};

export default function ConfirmModal({ mensagem, onConfirm, onCancel, tipo = "info" }) {
  const config = tipoConfig[tipo] || tipoConfig.info;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex flex-col items-center text-center gap-4">
          {config.icon}
          <p className="text-gray-700">{mensagem}</p>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`${config.corBotao} text-white px-4 py-2 rounded`}
          >
            {config.textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}
