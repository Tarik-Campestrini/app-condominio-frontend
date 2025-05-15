import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/auth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Nav from "../../components/Menu";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signin } = useAuth();

  useEffect(() => {
    // Mantém o dark mode ativado se for preferência do sistema ou localStorage
    if (
      localStorage.getItem("darkMode") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signin(email, password);
      if (!response) {
        navigate("/home", { replace: true });
      } else {
        setError(response);
      }
    } catch (error) {
      console.error(error);
      setError("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <Nav />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
            Área do Administrador
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 border border-gray-300 dark:border-gray-600"
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 border border-gray-300 dark:border-gray-600"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              Text="Entrar"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2 w-full transition duration-300"
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Index;
