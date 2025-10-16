import React from "react";
import Encabezado from "../componentes/Encabezado/Encabezado";
import BarraLateral from "../componentes/BarraLateral/BarraLateral";
import "./SiguiendoGrid.css";
import "./Inicio/Inicio.css";

// Ejemplo de datos de canales seguidos
const canalesSeguidos = [

  {
    nombre: "LACOBRAAA",
    avatar: "",
    fondo: "",
  },
  {
    nombre: "leaosggg",
    avatar: "",
    fondo: "",
  },
  {
    nombre: "fanodric",
    avatar: "",
    fondo: "",
  },
   
  
  
];

const SiguiendoGrid = () => {
  return (
    <div className="inicio">
      <div className="inicio__layout">
        <BarraLateral />
        <div className="inicio__main">
          <Encabezado />
          <main className="inicio__contenido">
            <div className="siguiendo-container">
              <h1 className="siguiendo-titulo">Siguiendo</h1>
              <div className="siguiendo-grid">
                {canalesSeguidos.map((canal) => (
                  <div
                    className="canal-card"
                    key={canal.nombre}
                    style={{ backgroundImage: `url(${canal.fondo})` }}
                  >
                    <div className="canal-heart-corner">
                      <span className="corazon-normal">
                        {/* Modern Heart Outline (Heroicons) con borde #00bfff */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfff" width="22" height="22">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75A5.25 5.25 0 0122 9c0 7.25-9.5 11.25-9.5 11.25S3 16.25 3 9a5.25 5.25 0 015.5-5.25c1.61 0 3.04.76 4 1.97a5.25 5.25 0 014-1.97z" />
                        </svg>
                      </span>
                      <span className="corazon-roto">
                        {/* Modern Broken Heart (custom) con borde #00bfff */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfff" width="22" height="22">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75A5.25 5.25 0 0122 9c0 7.25-9.5 11.25-9.5 11.25S3 16.25 3 9a5.25 5.25 0 015.5-5.25c1.61 0 3.04.76 4 1.97a5.25 5.25 0 014-1.97z" />
                          <path stroke="#00bfff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 7l-2 4 3 3-2 4" />
                        </svg>
                      </span>
                    </div>
                    <div className="canal-card-overlay">
                      <img className="canal-avatar" src={canal.avatar} alt="" />
                      <div className="canal-nombre">{canal.nombre}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SiguiendoGrid;
