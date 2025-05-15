import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RoutesApp from './routes';
import { AuthProvider } from "./contexts/AuthContext/auth";
import { ThemeProvider } from './contexts/ThemeContext';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
