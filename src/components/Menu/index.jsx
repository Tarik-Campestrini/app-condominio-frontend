import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme"; // com alias, ou ajuste para ../../hooks/useTheme

const Nav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 shadow-md">
  <div className="flex justify-between items-center px-4">
    <div className="text-white dark:text-gray-200 text-xl font-bold">Edifício Elizabeth</div>

    {/* Menu desktop */}
    <ul className="hidden lg:flex gap-8 items-center ml-auto">
      <li>
        <Link to="/" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400">Início</Link>
      </li>
      <li>
        <Link to="/admin" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400">Admin</Link>
      </li>
      <li>
        <Link to="/contato" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400">Contato</Link>
      </li>

      {/* Botão de alternância de tema aqui ao lado de Contato */}
      <li>
        <button
          onClick={toggleTheme}
          className="text-white dark:text-gray-200 text-xl focus:outline-none"
          title="Alternar tema"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </li>
    </ul>

    {/* Botão do menu para celular */}
    <button
      className="text-white dark:text-gray-200 lg:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>

  {/* Menu mobile */}
  {isOpen && (
    <ul className="lg:hidden flex flex-col gap-4 bg-blue-700 dark:bg-gray-700 p-4 mt-2 rounded">
      <li>
        <Link to="/" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block">Início</Link>
      </li>
      <li>
        <Link to="/admin" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block">Admin</Link>
      </li>
      <li>
        <Link to="/contato" className="text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-400 block">Contato</Link>
      </li>
      <li>
        <button
          onClick={toggleTheme}
          className="text-white dark:text-gray-200 text-xl focus:outline-none"
          title="Alternar tema"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </li>
    </ul>
  )}
</nav>
  );
};

export default Nav;
