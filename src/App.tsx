import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Inicio from "./paginas/Inicio/Inicio";
import CatalogoRegalosCliente from "./paginas/CatalogoRegalosCliente";
import PanelRegalosStreamer from "./paginas/PanelRegalosStreamer";
import Dashboard from "./componentes/Dashboard/Dashboard";
import Nosotros from "./componentes/Nosotros/Nosotros";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal con layout completo */}
        <Route path="/" element={<Inicio />} />
        
        {/* Páginas de autenticación (sin layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Página Nosotros */}
        <Route path="/nosotros" element={<Nosotros />} />
        
  {/* Páginas específicas (con layout) */}
  <Route path="/regalos" element={<CatalogoRegalosCliente />} />
  <Route path="/streamer/panel" element={<PanelRegalosStreamer />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              horasTransmision={120}
              notifications={[
                { mensaje: "Leandro te siguió!", tiempo: "5min ago" },
                { mensaje: "Andrea te donó 10 estrellas", tiempo: "just now" },
                { mensaje: "Carlos te envió un regalo", tiempo: "1h ago" },
                { mensaje: "María te siguió!", tiempo: "2h ago" },
                { mensaje: "Luis te donó 5 estrellas", tiempo: "3h ago" },
                { mensaje: "Ana te envió un regalo", tiempo: "4h ago" },
                { mensaje: "Pedro te siguió!", tiempo: "5h ago" },
                { mensaje: "Sofía te donó 20 estrellas", tiempo: "6h ago" },
                { mensaje: "Javier te envió un regalo", tiempo: "7h ago" },
                { mensaje: "Lucía te siguió!", tiempo: "8h ago" },
                { mensaje: "Miguel te donó 15 estrellas", tiempo: "9h ago" },
                { mensaje: "Elena te envió un regalo", tiempo: "10h ago" }
              ]}
            />
          }
        />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


