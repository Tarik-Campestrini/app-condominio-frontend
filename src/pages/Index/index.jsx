import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/auth"; // Importando o contexto de autenticação
import Input from "../../components/Input";
import Button from "../../components/Button";
import Nav from "../../components/Menu";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signin } = useAuth(); // Pega a função de login do AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signin(email, password);
      // Verifica se o login foi bem-sucedido
      if (!response) {
        
        navigate("/home", { replace: true }); // Redireciona para a página home
      } else {
        setError(response); // Mostra o erro se houver
      }
    } catch (error) {
      console.error(error);
      setError("Erro na conexão com o servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Área do Morador</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              Text="Entrar"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2 w-full transition duration-300"
            />
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            Ainda não tem conta? <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
