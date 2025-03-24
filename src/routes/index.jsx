import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Home from "../pages/home";
import Entregas from "../pages/entregas";
import Usuarios from "../pages/usuarios";
import Avisos from "../pages/avisos";
 // Importe a página de aviso
import useAuth from "../hooks/useAuth";
import { Footer } from "@/components/ui/footer";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/entregas" element={<PrivateRoute element={<Entregas />} />} />
        <Route path="/usuarios" element={<PrivateRoute element={<Usuarios />} />} />
        <Route path="/avisos" element={<PrivateRoute element={<Avisos />} />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default RoutesApp;