import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Inicio from "./paginas/Inicio/Inicio";
import CatalogoRegalosCliente from "./paginas/CatalogoRegalosCliente";
import PanelRegalosStreamer from "./paginas/PanelRegalosStreamer";
import TerminosyCondiciones from "./paginas/TerminosyCondiciones";
import PoliticasPrivacidad from "./paginas/PoliticasPrivacidad";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal con layout completo */}
        <Route path="/" element={<Inicio />} />
        
        {/* Páginas de autenticación (sin layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Página de Términos y Condiciones */}
        <Route path="/terminos" element={<TerminosyCondiciones />} />
        <Route path="/politicas" element={<PoliticasPrivacidad />} />

        
        {/* Páginas específicas (con layout) */}
        <Route path="/regalos" element={<CatalogoRegalosCliente />} />
        <Route path="/streamer/panel" element={<PanelRegalosStreamer />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


