import React from "react";
import "./BarraLateral.css";
import logoNexus from "../../assets/nexus-logo.png";

const menuItems = [
	{ icon: (
		<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3 11.5L12 4l9 7.5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
			<rect x="6" y="12" width="12" height="8" rx="2" stroke="#fff" strokeWidth="2"/>
		</svg>
	), label: "Inicio" },
	{ icon: <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#fff" strokeWidth="2"/></svg>, label: "Explorar" },
	{ icon: <svg width="24" height="24" fill="none"><path d="M12 21s-6-4.35-6-10A6 6 0 0112 5a6 6 0 016 6c0 5.65-6 10-6 10z" stroke="#fff" strokeWidth="2"/></svg>, label: "Siguiendo" },
];

const recomendados = [
	{ nombre: "dequiv", juego: "Grand Theft Auto V", espectadores: "2,7 mil", online: true },
	{ nombre: "ELTIOPANGOOO", juego: "Dota 2", espectadores: "517", online: true },
	{ nombre: "ijenz", juego: "Conversando", espectadores: "7 mil", online: true },
	{ nombre: "Jcorko", juego: "Grand Theft Auto V", espectadores: "1,6 mil", online: true },
	{ nombre: "KhaleesiS2", juego: "Slots & Casino", espectadores: "83", online: true },
	{ nombre: "LizzB", juego: "VALORANT", espectadores: "1,1 mil", online: true },
	{ nombre: "Dylantero", juego: "Slots & Casino", espectadores: "153", online: true },
	{ nombre: "Lokonazo1", juego: "Counter-Strike 2", espectadores: "577", online: true },
	{ nombre: "ESB_DOTA", juego: "Dota 2", espectadores: "524", online: true },
	{ nombre: "Dragkero", juego: "Resident Evil 0", espectadores: "451", online: true },
];

const BarraLateral: React.FC = () => {
	return (
		<aside className="barra-lateral">
			<div className="barra-lateral__top">
				<span className="barra-lateral__menu">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect y="7" width="32" height="3" rx="1.5" fill="#fff"/>
						<rect y="14" width="32" height="3" rx="1.5" fill="#fff"/>
						<rect y="21" width="32" height="3" rx="1.5" fill="#fff"/>
					</svg>
				</span>
				<img src={logoNexus} alt="Logo Nexus" className="barra-lateral__logo" />
			</div>
			<nav className="barra-lateral__menu-items">
				{menuItems.map((item, idx) => (
					<div key={idx} className="barra-lateral__item">
						<span className="barra-lateral__icon">{item.icon}</span>
						<span className="barra-lateral__label">{item.label}</span>
					</div>
				))}
			</nav>
			{/* Línea separadora antes de recomendados */}
			<div className="barra-lateral__divider" />
			<div className="barra-lateral__recomendados">
				<div className="barra-lateral__recomendados-titulo">Recomendado</div>
				{recomendados.map((user, idx) => (
					<div key={idx} className="barra-lateral__user">
						<div className="barra-lateral__user-avatar" />
						<div className="barra-lateral__user-info">
							<span className="barra-lateral__user-nombre">{user.nombre}</span>
							<span className="barra-lateral__user-juego">{user.juego}</span>
						</div>
						<span className="barra-lateral__user-online" />
						<span className="barra-lateral__user-espectadores">{user.espectadores}</span>
					</div>
				))}
			</div>
			<div className="barra-lateral__acciones">
				<button className="barra-lateral__accion">Mostrar más</button>
				<button className="barra-lateral__accion">Mostrar Menos</button>
			</div>
		</aside>
	);
};

export default BarraLateral;
