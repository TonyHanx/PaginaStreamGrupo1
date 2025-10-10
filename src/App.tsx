
import React from "react";
import Encabezado from "./componentes/Encabezado/Encabezado";
import BarraLateral from "./componentes/BarraLateral/BarraLateral";
import ImagenCarrusel from "./componentes/Carrusel/ImagenCarrusel";


const thumbs = [
  { id: 1, src: "/thumbs/stream-1.jpg", alt: "Stream 1" },
  { id: 2, src: "/thumbs/stream-2.jpg", alt: "Stream 2" },
  { id: 3, src: "/thumbs/stream-3.jpg", alt: "Stream 3" },
  { id: 4, src: "/thumbs/stream-4.jpg", alt: "Stream 4" },
  { id: 5, src: "/thumbs/stream-5.jpg", alt: "Stream 5" }
];




const App: React.FC = () => {
  return (
    <div className="app-container d-flex">
      <BarraLateral />
      <div className="flex-grow-1 main-content">
        <Encabezado />
        <ImagenCarrusel items={thumbs} itemWidth={280} gap={16} />
        {/* Aquí puedes agregar el resto de la plataforma */}
      </div>
    </div>
  );
};

export default App;
