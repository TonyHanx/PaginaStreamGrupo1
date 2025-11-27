import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Encabezado, { type EncabezadoHandle } from "../../componentes/Encabezado/Encabezado";
import BarraLateral from "../../componentes/BarraLateral/BarraLateral";
import CarruselStreams from "../../componentes/CarruselStreams/CarruselStreams";
import ListaCategorias from "../../componentes/ListaCategorias/ListaCategorias";
import "./Inicio.css";

const Inicio: React.FC = () => {
	const encabezadoRef = useRef<EncabezadoHandle>(null);
	const location = useLocation();

	useEffect(() => {
		// Detectar si viene de términos o políticas
		const params = new URLSearchParams(location.search);
		if (params.get('openRegister') === 'true') {
			encabezadoRef.current?.showRegisterModal();
		}
	}, [location]);

	const handleShowLogin = () => {
		encabezadoRef.current?.showLoginModal();
	};

	// Detectar si hay usuario logueado
	const usuario = typeof window !== 'undefined' ? sessionStorage.getItem('USUARIO') : null;
	const mostrarAuthButtons = !usuario;

	return (
		<div className="inicio">
			<div className="inicio__layout">
				<BarraLateral onShowLogin={handleShowLogin} />
				<div className="inicio__main">
					<Encabezado ref={encabezadoRef} mostrarAuthButtons={mostrarAuthButtons} />
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