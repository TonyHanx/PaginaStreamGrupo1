import React, { useRef } from "react";
import Encabezado, { type EncabezadoHandle } from "../../componentes/Encabezado/Encabezado";
import BarraLateral from "../../componentes/BarraLateral/BarraLateral";
import CarruselStreams from "../../componentes/CarruselStreams/CarruselStreams";
import ListaCategorias from "../../componentes/ListaCategorias/ListaCategorias";
import "./Inicio.css";

const Inicio: React.FC = () => {
	const encabezadoRef = useRef<EncabezadoHandle>(null);

	const handleShowLogin = () => {
		// Llamar al método del Encabezado para mostrar el modal de login
		encabezadoRef.current?.showLoginModal();
	};

	return (
		<div className="inicio">
			<div className="inicio__layout">
				<BarraLateral onShowLogin={handleShowLogin} />
				<div className="inicio__main">
					<Encabezado ref={encabezadoRef} />
					<div className="inicio__carrusel-container">
						<CarruselStreams />
					</div>
					<main className="inicio__contenido">
						<ListaCategorias />
					</main>
				</div>
			</div>
		</div>
	);
};

export default Inicio;