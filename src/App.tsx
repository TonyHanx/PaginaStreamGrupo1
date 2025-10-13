import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Encabezado from "./componentes/Encabezado/Encabezado";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Encabezado />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


