
import React, { useState, useImperativeHandle, forwardRef } from "react";
import "./Encabezado.css";
import Login from "../../paginas/Login";
import Register from "../../paginas/Register";

export interface EncabezadoHandle {
	showLoginModal: () => void;
	showRegisterModal: () => void;
}

const Encabezado = forwardRef<EncabezadoHandle>((props, ref) => {
	const [modal, setModal] = useState<null | 'login' | 'register'>(null);
	const closeModal = () => setModal(null);
	
	const handleLoginClick = () => {
		setModal('login');
	};

	useImperativeHandle(ref, () => ({
		showLoginModal: () => setModal('login'),
		showRegisterModal: () => setModal('register')
	}));
	
	return (
		<div>
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
					<button className="encabezado__login" onClick={handleLoginClick}>Iniciar sesión</button>
					<button className="encabezado__register" onClick={() => setModal('register')}>Registrarse</button>
				</div>
			</header>

			{/* Modal */}
			{modal && (
				<div style={{
					position: 'fixed',
					top: 0, left: 0, right: 0, bottom: 0,
					background: 'rgba(0,0,0,0.7)',
					zIndex: 1000,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}} onClick={closeModal}>
					<div style={{ position: 'relative', zIndex: 1010 }} onClick={e => e.stopPropagation()}>
						<button onClick={closeModal} style={{
							position: 'absolute',
							top: 12, right: 12,
							background: 'transparent',
							border: 'none',
							color: '#fff',
							fontSize: 28,
							cursor: 'pointer',
							zIndex: 1020
						}}>&times;</button>
						{modal === 'login' ? (
							<Login onShowRegister={() => setModal('register')} />
						) : (
							<Register onShowLogin={() => setModal('login')} />
						)}
					</div>
				</div>
			)}
		</div>
	);
});

export default Encabezado;


