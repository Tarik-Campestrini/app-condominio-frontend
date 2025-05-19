import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        <div className="text-white dark:text-gray-200 text-xl font-bold">
          Edifício Elizabeth
        </div>

        {/* Menu desktop */}
        <ul className="hidden lg:flex gap-8 items-center ml-auto">
          <li>
            <Link
              to="/"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400"
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400"
            >
              Admin
            </Link>
          </li>
          <li>
            <Link
              to="/contato"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400"
            >
              Contato
            </Link>
          </li>
        </ul>

        <div>

        </div>
        {/* Botão modo dark sempre visível (desktop e mobile) */}
        <button
          onClick={toggleDarkMode}
                className="text-white dark:text-gray-300 text-lg px-2 py-1 border border-white dark:border-gray-500 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition"
                aria-label="Alternar modo escuro" 
        >

          {darkMode ? "🌙" : "☀️"}
        </button>

        {/* Botão do menu para celular */}
        <button
          className="tsm:hidden text-white focus:outline-noneext-white dark:text-gray-200 lg:hidden ml-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <ul className="lg:hidden flex flex-col gap-4 bg-blue-700 dark:bg-gray-700 p-4 mt-2 rounded">
          <li>
            <Link
              to="/"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </li>
          <li>
            <Link
              to="/contato"
              className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
