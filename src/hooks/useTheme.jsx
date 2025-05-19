import { useEffect, useState } from "react";

function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    // fallback para preferências do sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(() => {
    const initialTheme = getInitialTheme();
    applyThemeClass(initialTheme); // aplica imediatamente ao iniciar
    return initialTheme;
  });

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
