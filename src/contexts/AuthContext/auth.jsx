/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const userData = localStorage.getItem("user_data"); // Agora pegamos os dados do usuário

    if (userToken && userData) {
      setUser(JSON.parse(userData)); // Define os dados do usuário
    }
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_data", JSON.stringify({ nome: data.nome, email })); // Salvamos o nome
        setUser({ nome: data.nome, email });
        return null;
      } else {
        return "E-mail ou senha incorretos!";
      }
    } catch (error) {
      return "Erro na conexão com o servidor!";
    }
  };

  const signout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data"); // Remove os dados do usuário
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
