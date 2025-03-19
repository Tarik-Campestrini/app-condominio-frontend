import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        {/* Logo */}
        <div className="text-white text-xl font-bold">Edifício Elizabeth</div>

        {/* Menu totalmente à direita, sem espaço extra */}
        <ul className="flex gap-8 ml-auto pr-0">
          <li>
            <Link to="/" className="text-white hover:text-gray-200">Início</Link>
          </li>
          <li>
            <Link to="/admin" className="text-white hover:text-gray-200">Admin</Link>
          </li>
          <li>
            <Link to="/contato" className="text-white hover:text-gray-200">Contato</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav; 