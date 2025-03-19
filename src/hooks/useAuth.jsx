import { useState, useEffect } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("user_token"); // Verifica se o token já está no localStorage
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("user_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", checkAuth); // 🔹 Monitora mudanças no localStorage

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return isAuthenticated;
};

export default useAuth;
