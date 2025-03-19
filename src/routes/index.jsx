import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Home from "../pages/home";
import Entregas from "../pages/entregas";
import Usuarios from "../pages/usuarios";
import useAuth from "../hooks/useAuth";
import { Footer } from "/src/components/ui/footer";

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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default RoutesApp;
