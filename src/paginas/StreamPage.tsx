import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import Encabezado, { type EncabezadoHandle } from "../componentes/Encabezado/Encabezado";
import BarraLateral from "../componentes/BarraLateral/BarraLateral";
import VistaStream from "../componentes/VistaStream/VistaStream";
import "./Inicio/Inicio.css";

const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const encabezadoRef = useRef<EncabezadoHandle>(null);

  const handleShowLogin = () => {
    encabezadoRef.current?.showLoginModal();
  };

  return (
    <div className="inicio">
      <div className="inicio__layout">
        <BarraLateral onShowLogin={handleShowLogin} />
        <div className="inicio__main">
          <Encabezado ref={encabezadoRef} />
          <VistaStream streamerId={streamerId} />
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
