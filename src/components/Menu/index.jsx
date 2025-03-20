import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Ícones para o menu

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        <div className="text-white text-xl font-bold">Edifício Elizabeth</div>

        {/* Botão do menu para celular */}
        <button 
          className="text-white lg:hidden" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu desktop */}
        <ul className="hidden lg:flex gap-8 ml-auto">
          <li><Link to="/" className="text-white hover:text-gray-200">Início</Link></li>
          <li><Link to="/admin" className="text-white hover:text-gray-200">Admin</Link></li>
          <li><Link to="/contato" className="text-white hover:text-gray-200">Contato</Link></li>
        </ul>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <ul className="lg:hidden flex flex-col gap-4 bg-blue-700 p-4 mt-2 rounded">
          <li><Link to="/" className="text-white hover:text-gray-200 block">Início</Link></li>
          <li><Link to="/admin" className="text-white hover:text-gray-200 block">Admin</Link></li>
          <li><Link to="/contato" className="text-white hover:text-gray-200 block">Contato</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
