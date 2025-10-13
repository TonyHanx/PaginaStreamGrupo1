import React, { useRef } from "react";
import Encabezado, { type EncabezadoHandle } from "../../componentes/Encabezado/Encabezado";
import BarraLateral from "../../componentes/BarraLateral/BarraLateral";
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
					<main className="inicio__contenido">
						<div className="inicio__bienvenida">
							<h1>Bienvenido a Nexus Stream</h1>
							<p>Descubre los mejores streamers y contenido en vivo</p>
						</div>
						{/* Aquí se pueden agregar más componentes como ListaCategorias y VistaStream cuando estén listos */}
					</main>
				</div>
			</div>
		</div>
	);
};

export default Inicio;