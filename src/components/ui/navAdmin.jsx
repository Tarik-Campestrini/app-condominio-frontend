import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext/auth"; // Certifique-se do caminho correto

export default function NavAdmin() {
  const navigate = useNavigate();
  const { user, signout } = useAuth(); // Obtém os dados do usuário do contexto

  const handleLogout = () => {
    signout();
    navigate("/"); // Redireciona para a página de login
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        {/* Nome do Edifício */}
        <div className="text-white text-xl font-bold">Edifício Elizabeth</div>

        {/* Mensagem de boas-vindas */}
        {user && (
          <span className="text-white font-medium">
            Bem-vindo, {user.nome}!
          </span>
        )}

        {/* Menu de navegação */}
        <ul className="flex items-center gap-8 ml-auto pr-0">
          <li><Link to="/home" className="text-white hover:text-gray-200">Início</Link></li>
          <li><Link to="/entregas" className="text-white hover:text-gray-200">Entregas</Link></li>
          <li><Link to="/usuarios" className="text-white hover:text-gray-200">Moradores</Link></li>
          <li>
            <button 
              onClick={handleLogout} 
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
