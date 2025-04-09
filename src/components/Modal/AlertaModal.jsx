import React, { useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle } from "lucide-react";

const cores = {
  sucesso: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
  erro: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
  },
};

export default function AlertaModal({ tipo = "info", mensagem, onClose }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    setVisivel(true);
    const timer = setTimeout(() => {
      setVisivel(false);
      setTimeout(onClose, 300); // tempo da transição
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const estilo = cores[tipo] || cores.info;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-3 px-6 py-4 border rounded-lg shadow-lg transition-all duration-300 ${
          visivel ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } ${estilo.bg} ${estilo.text} ${estilo.border}`}
      >
        {estilo.icon}
        <span className="text-sm font-medium">{mensagem}</span>
      </div>
    </div>
  );
}
