import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext/auth"; // Certifique-se do caminho correto
import { Menu, X } from "lucide-react"; // Ícones para o menu

export default function NavAdmin() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar o menu

  const handleLogout = () => {
    signout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        {/* Nome do Edifício */}
        <div className="text-white text-xl font-bold">Edifício Elizabeth</div>

        {/* Mensagem de boas-vindas */}
        {user && (
          <span className="hidden sm:block text-white font-medium">
            Bem-vindo, {user.nome}!
          </span>
        )}

        {/* Botão de menu para celular */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu de navegação para telas maiores */}
        <ul className="hidden sm:flex items-center gap-8 ml-auto">
          <li><Link to="/home" className="text-white hover:text-gray-200">Início</Link></li>
          <li><Link to="/entregas" className="text-white hover:text-gray-200">Entregas</Link></li>
          <li><Link to="/usuarios" className="text-white hover:text-gray-200">Moradores</Link></li>
          <Link to="/avisos" className="text-white hover:text-gray-200">Avisos</Link>
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

      {/* Menu dropdown para telas pequenas */}
      {menuOpen && (
  <ul className="sm:hidden flex flex-col items-center gap-4 bg-blue-700 p-4 mt-2 rounded-lg shadow-md">
    <li><Link to="/home" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Início</Link></li>
    <li><Link to="/entregas" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Entregas</Link></li>
    <li><Link to="/usuarios" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Moradores</Link></li>
    <li><Link to="/avisos" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Avisos</Link></li>
    <li>
      <button 
        onClick={() => { handleLogout(); setMenuOpen(false); }} 
        className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Sair
      </button>
    </li>
  </ul>
)}
    </nav>
  );
}
