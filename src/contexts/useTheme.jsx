import { createContext, useContext, useState, useEffect } from "react";

// Cria o contexto
const ThemeContext = createContext();

// Provider do tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Tenta pegar o tema salvo no localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  // Aplica a classe do Tailwind no <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Salva no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Alternador
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado
export const useTheme = () => useContext(ThemeContext);
