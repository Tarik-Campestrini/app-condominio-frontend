import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext/auth";
import { Menu, X } from "lucide-react";

export default function NavAdmin() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    signout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md dark:bg-gray-800">
      <div className="flex justify-between items-center px-4">
        {/* Nome do Edifício */}
        <div className="text-white text-xl font-bold">Edifício Elizabeth</div>

        {/* Mensagem de boas-vindas */}
        {user && (
          <span className="hidden sm:inline-block text-white font-medium ml-4">
            Bem-vindo, {user.nome}!
          </span>
        )}

        {/* Menu desktop */}
        <ul className="hidden sm:flex items-center gap-8 ml-auto">
          <li><Link to="/home" className="text-white hover:text-gray-200">Início</Link></li>
          <li><Link to="/entregas" className="text-white hover:text-gray-200">Entregas</Link></li>
          <li><Link to="/usuarios" className="text-white hover:text-gray-200">Moradores</Link></li>
          <li><Link to="/avisos" className="text-white hover:text-gray-200">Avisos</Link></li>
          <li>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2  rounded hover:bg-red-600 transition"
              >
                Sair
              </button>
              <div></div>
            </div>
          </li>
        </ul>
        {/* Botões no lado direito (menu mobile + dark mode) */}
        <div className="flex items-center gap-2 ml-0">
          {/* Botão modo dark */}
          <button
                onClick={toggleDarkMode}
                className="text-white dark:text-gray-300 text-lg px-2 py-1 border border-white dark:border-gray-500 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition"
                aria-label="Alternar modo escuro"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

          {/* Botão menu mobile */}
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
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
