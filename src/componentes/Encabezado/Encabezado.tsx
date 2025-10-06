
import React from "react";
import "./Encabezado.css";
import logoNexus from "../../assets/nexus-logo.png";

const Encabezado: React.FC = () => {
	return (
		<header className="encabezado">
					<div className="encabezado__menu-logo">
						{/* Solo espacio para alineación izquierda, sin menú hamburguesa ni logo */}
					</div>
			<div className="encabezado__busqueda-container">
				<span className="encabezado__busqueda-icon">
					<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2" />
						<line x1="15" y1="15" x2="19" y2="19" stroke="#fff" strokeWidth="2" />
					</svg>
				</span>
				<input className="encabezado__busqueda" type="text" placeholder="Buscar" />
			</div>
				<div className="encabezado__acciones">
											<button className="encabezado__donar" title="Donar a streamers">
												<span className="encabezado__donar-icon">
																<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																	{/* Orejas largas */}
																	<ellipse cx="14" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
																	<ellipse cx="26" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
																	{/* Cara redonda */}
																	<ellipse cx="20" cy="22" rx="10" ry="10" fill="#00bfff" stroke="#fff" strokeWidth="2" />
																	{/* Nariz */}
																	<ellipse cx="20" cy="26" rx="2" ry="1.2" fill="#fff" />
																	{/* Ojos */}
																	<ellipse cx="16" cy="22" rx="1" ry="1.5" fill="#fff" />
																	<ellipse cx="24" cy="22" rx="1" ry="1.5" fill="#fff" />
																	{/* Boca */}
																	<path d="M18 28 Q20 30 22 28" stroke="#fff" strokeWidth="1.5" fill="none" />
																	{/* Rayos de relámpago */}
																	<g className="encabezado__donar-rays">
																		<polyline points="7,10 12,13 9,17" stroke="#fff200" strokeWidth="2" fill="none" />
																		<polyline points="33,10 28,13 31,17" stroke="#fff200" strokeWidth="2" fill="none" />
																		<polyline points="20,2 18,7 22,7" stroke="#fff200" strokeWidth="2" fill="none" />
																	</g>
																</svg>
												</span>
											</button>
					<button className="encabezado__login">Iniciar sesión</button>
					<button className="encabezado__register">Registrarse</button>
				</div>
		</header>
	);
};

export default Encabezado;
