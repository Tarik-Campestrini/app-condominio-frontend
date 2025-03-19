/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const userData = localStorage.getItem("user_data");

    if (userToken && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const signin = async (email, password) => {
    try {
      // Pegando a URL do backend corretamente
      const API_URL = import.meta.env.VITE_URI_BACKEND || "http://localhost:3000";

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));  // ✅ Agora salvamos o user corretamente
        setUser(data.user);
        return null;
      } else {
        return data.message || "E-mail ou senha incorretos!";
      }
    } catch (error) {
      return "Erro na conexão com o servidor!";
    }
  };

  const signout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
