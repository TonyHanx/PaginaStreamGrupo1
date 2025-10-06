import React from "react";
import Encabezado from "./componentes/Encabezado/Encabezado";
import BarraLateral from "./componentes/BarraLateral/BarraLateral";

const App: React.FC = () => {
  return (
    <div className="app-container d-flex">
      <BarraLateral />
      <div className="flex-grow-1 main-content">
        <Encabezado />
        {/* Aquí puedes agregar el resto de la plataforma */}
      </div>
    </div>
  );
};

export default App;
