import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import "./Encabezado.css";
import "./UserMenu.css";
import Login from "../../paginas/Login";
import Register from "../../paginas/Register";
import TerminosyCondiciones from "../../paginas/TerminosyCondiciones";
import PoliticasPrivacidad from "../../paginas/PoliticasPrivacidad";
import { ModalProvider } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import { obtenerMonedasUsuario } from "../../utils/monedas";
import BunnySVG from '../Icons/BunnySVG';
import { calcularNivel } from "../../utils/puntos";


export interface EncabezadoHandle {
  showLoginModal: () => void;
  showRegisterModal: () => void;
  showTerminosModal: () => void;
  showPoliticasModal: () => void;
}

export interface EncabezadoProps {
  mostrarAuthButtons?: boolean;
}

// Eliminar la función local duplicada calcularNivel

function UserMenu({ username }: { username: string }) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	
	// Obtener datos del usuario desde sessionStorage
	const usuarioStr = sessionStorage.getItem('USUARIO');
	let usuarioData = { username, puntos: 0, userId: 'demo-user' };
	try {
		const parsed = usuarioStr ? JSON.parse(usuarioStr) : {};
		usuarioData = {
			username: parsed.username || username,
			puntos: parsed.puntos || 0,
			userId: parsed.userId || 'demo-' + username
		};
	} catch {
		// Si hay error, usar valores por defecto con un ID único
		usuarioData = { username, puntos: 0, userId: 'demo-' + username };
	}
	
	const { nivel, puntosNivel, puntosParaSiguiente } = calcularNivel(usuarioData.puntos);
	const progresoNivel = (puntosNivel / puntosParaSiguiente) * 100;

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	function handleLogout() {
		sessionStorage.removeItem("USUARIO");
		window.location.reload();
	}

	return (
		<div ref={menuRef} className="user-menu">
			<button
				onClick={() => setOpen((v) => !v)}
				className="user-menu__button"
			>
				<span className="user-menu__avatar">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="12" fill="#181b1f" />
						<circle cx="12" cy="9.5" r="4" stroke="#00bfff" strokeWidth="1.7" />
						<path d="M5.5 19c1.2-2.7 4.8-2.7 6.5-2.7s5.3 0 6.5 2.7" stroke="#00bfff" strokeWidth="1.7" strokeLinecap="round" fill="none" />
					</svg>
				</span>
				<span className="user-menu__username">{username}</span>
			</button>
			{open && (
				<div className="user-menu__dropdown">
					{/* Información del usuario con avatar */}
					<div className="user-menu__header">
						<span className="user-menu__header-avatar">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="12" fill="#232329" />
								<circle cx="12" cy="9.5" r="4" stroke="#00bfff" strokeWidth="1.7" />
								<path d="M5.5 19c1.2-2.7 4.8-2.7 6.5-2.7s5.3 0 6.5 2.7" stroke="#00bfff" strokeWidth="1.7" strokeLinecap="round" fill="none" />
							</svg>
						</span>
						<div className="user-menu__header-info">
							<div className="user-menu__header-username">{username}</div>
						</div>
					</div>
					
					{/* Sección de nivel y puntos */}
					<div className="user-menu__level-section">
						<div className="user-menu__level-row">
							<div className="user-menu__level-info">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
								</svg>
								<span className="user-menu__level-text">Nivel {nivel}</span>
							</div>
							<div className="user-menu__level-points">
								{puntosNivel}/{puntosParaSiguiente} pts
							</div>
						</div>
						{/* Barra de progreso */}
						<div className="user-menu__progress-bar">
							<div className="user-menu__progress-fill" style={{ width: `${progresoNivel}%` }}></div>
						</div>
						<div className="user-menu__total-points">
							Total: {usuarioData.puntos.toLocaleString()} puntos
						</div>
					</div>
					
					<div className="user-menu__menu-items">
						<MenuItem icon={
							// Icono TV/Canal
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="4" width="16" height="11" rx="1.5" stroke="#fff" strokeWidth="1.5"/><path d="M2 7h16M6 17h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
						} label="Canal" onClick={() => {
							setOpen(false);
							navigate(`/stream/${usuarioData.userId}`);
						}} />
						<MenuItem icon={
							// Barras (panel de control)
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="13" width="2.5" height="3" rx="1" stroke="#fff" strokeWidth="1.5"/><rect x="8.75" y="9" width="2.5" height="7" rx="1" stroke="#fff" strokeWidth="1.5"/><rect x="13.5" y="6" width="2.5" height="10" rx="1" stroke="#fff" strokeWidth="1.5"/></svg>
						} label="Panel de control del creador" onClick={() => {
							setOpen(false);
							navigate("/dashboard");
						}} />
						<MenuItem icon={
							// Icono de regalo personalizado
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="8" width="14" height="9" rx="1" stroke="#fff" strokeWidth="1.5"/><path d="M10 8v9M3 11h14" stroke="#fff" strokeWidth="1.5"/><path d="M7 8c0-1.5.5-3 3-3s3 1.5 3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
						} label="Gestionar Regalos" onClick={() => {
							setOpen(false);
							navigate("/streamer/panel");
						}} />
						<MenuItem icon={
							// Icono estrella para suscripciones
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="#fff" strokeWidth="1.5"/></svg>
						} label="Suscripciones" />
						<MenuItem icon={
							// Engranaje para ajustes
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><g stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="3.2" fill="none"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.6 5.6l1.4 1.4M13 13l1.4 1.4M5.6 14.4l1.4-1.4M13 7l1.4-1.4"/></g></svg>
						} label="Ajustes" />
						<MenuItem icon={
							// Icono de regalo/drops
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="8" width="14" height="9" rx="1" stroke="#fff" strokeWidth="1.5"/><path d="M10 8v9M3 11h14" stroke="#fff" strokeWidth="1.5"/><path d="M7 8c0-1.5.5-3 3-3s3 1.5 3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
						} label="Catálogo de Regalos" onClick={() => {
							setOpen(false);
							navigate("/regalos");
						}} />
					</div>
					<div className="user-menu__divider">
						<MenuItem icon={
							// Icono cerrar sesión 
							<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><g stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="7" height="10" rx="2"/><path d="M13 10h4"/><path d="M15.5 7.5L18 10l-2.5 2.5"/></g></svg>
						} label="Cerrar sesión" onClick={handleLogout} color="#f87171" />
					</div>
				</div>
			)}
		</div>
	);
}

function MenuItem({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick?: () => void, color?: string }) {
	return (
		<div
			onClick={onClick}
			className={`menu-item ${!onClick ? 'menu-item--default' : ''} ${color === '#f87171' ? 'menu-item--logout' : ''}`}
			style={{ color: color || '#fff' }}
			onMouseDown={e => e.preventDefault()}
		>
			{icon}
			<span>{label}</span>
		</div>
	);
}


// use shared BunnySVG component

const recargaMonedasOpciones = [
	{ cantidad: 100, precio: '1,09 US$' },
	{ cantidad: 250, precio: '2,69 US$' },
	{ cantidad: 500, precio: '5,29 US$' },
	{ cantidad: 1000, precio: '10,55 US$' },
	{ cantidad: 2500, precio: '26,35 US$' },
	{ cantidad: 5000, precio: '52,69 US$' },
	{ cantidad: 10000, precio: '105,29 US$' },
];

const NOTIFICACIONES_PREDEFINIDAS = [
	{
		id: 1,
		titulo: "¡Bienvenido a la plataforma!",
		descripcion: "Explora los streams y gana puntos por participar.",
		fecha: "2025-10-15"
	},
	{
		id: 2,
		titulo: "Nuevo logro desbloqueado",
		descripcion: "Has alcanzado el nivel 2. ¡Sigue participando!",
		fecha: "2025-10-14"
	},
	{
		id: 3,
		titulo: "Actualización de la plataforma",
		descripcion: "Ahora puedes canjear monedas por regalos exclusivos.",
		fecha: "2025-10-13"
	}
];

const Encabezado = forwardRef<EncabezadoHandle, EncabezadoProps>(({ mostrarAuthButtons = true }, ref) => {
  const [modal, setModal] = useState<null | 'login' | 'register' | 'monedas' | 'terminos' | 'politicas'>(null);
  const [notiAbierta, setNotiAbierta] = useState(false);
  const [saldoMonedas, setSaldoMonedas] = useState(0);
  const notiRef = useRef<HTMLDivElement>(null);
  
  // Actualizar saldo de monedas
  const actualizarSaldo = () => {
    const datos = obtenerMonedasUsuario();
    setSaldoMonedas(datos?.monedas || 0);
  };

  // Escuchar cambios en el saldo
  useEffect(() => {
    actualizarSaldo();
    window.addEventListener('monedas-actualizadas', actualizarSaldo);
    window.addEventListener('saldo-actualizado', actualizarSaldo);
    window.addEventListener('storage', actualizarSaldo);
    
    return () => {
      window.removeEventListener('monedas-actualizadas', actualizarSaldo);
      window.removeEventListener('saldo-actualizado', actualizarSaldo);
      window.removeEventListener('storage', actualizarSaldo);
    };
  }, []);

  const closeModal = () => {
    // Si estamos en términos o políticas, volver al registro
    if (modal === 'terminos' || modal === 'politicas') {
      setModal('register');
    } else {
      setModal(null);
    }
  };

  const handleLoginClick = () => setModal('login');

  useImperativeHandle(ref, () => ({
    showLoginModal: () => setModal('login'),
    showRegisterModal: () => setModal('register'),
    showTerminosModal: () => setModal('terminos'),
    showPoliticasModal: () => setModal('politicas')
  }));

  // Cerrar ventana de notificaciones al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiAbierta(false);
      }
    }
    if (notiAbierta) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notiAbierta]);

  // Detectar usuario logueado
  const usuario = typeof window !== 'undefined' ? sessionStorage.getItem('USUARIO') : null;
  let usuarioObj: { username?: string } | null = null;
  try {
    usuarioObj = usuario ? JSON.parse(usuario) : null;
  } catch {
    usuarioObj = null;
  }

  return (
    <div>
      <header className="encabezado">
        <div className="encabezado__menu-logo"></div>
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
          <button className="encabezado__donar" title="Recargar monedas" onClick={() => window.dispatchEvent(new CustomEvent('abrirTiendaMonedas'))}>
            <span className="encabezado__donar-icon">
              <BunnySVG />
            </span>
          </button>
          {/* Campanita de notificaciones */}
          <div className="encabezado__noti-wrapper" ref={notiRef}>
            <button className="encabezado__noti-bell" title="Notificaciones" onClick={() => setNotiAbierta((v) => !v)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3a5 5 0 0 1 5 5v2c0 1.2.6 2.3 1.6 3l.4.3a1 1 0 0 1-.6 1.8H5.6a1 1 0 0 1-.6-1.8l.4-.3A4.9 4.9 0 0 0 7 10V8a5 5 0 0 1 5-5z" stroke="#fff" strokeWidth="1.7" fill="none"/>
                <circle cx="12" cy="19" r="1.5" fill="#fff" />
              </svg>
            </button>
            {notiAbierta && (
              <div className="encabezado__noti-ventana desplegable">
                <div className="encabezado__noti-titulo">Notificaciones</div>
                <ul className="encabezado__noti-lista">
                  {NOTIFICACIONES_PREDEFINIDAS.map(noti => (
                    <li key={noti.id} className="encabezado__noti-item">
                      <div className="encabezado__noti-item-titulo">{noti.titulo}</div>
                      <div className="encabezado__noti-item-desc">{noti.descripcion}</div>
                      <div className="encabezado__noti-item-fecha">{noti.fecha}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Mostrar avatar y nombre si hay usuario logueado, sino mostrar botones de login */}
          {usuarioObj && usuarioObj.username ? (
            <UserMenu username={usuarioObj.username} />
          ) : (
            mostrarAuthButtons && (
              <>
                <button className="encabezado__login" onClick={handleLoginClick}>Iniciar sesión</button>
                <button className="encabezado__register" onClick={() => setModal('register')}>Registrarse</button>
              </>
            )
          )}
        </div>
      </header>

      {/* Modal de login/register/monedas */}
      {modal && (
        <div className="encabezado__modal-bg" onClick={closeModal}>
          <div className="encabezado__modal" onClick={e => e.stopPropagation()}>
            <button className="encabezado__modal-close" onClick={closeModal}>&times;</button>
            {modal === 'login' ? (
              <Login onShowRegister={() => setModal('register')} onLoginSuccess={closeModal} />
            ) : modal === 'register' ? (
              <ModalProvider value={{
                showTerminos: () => setModal('terminos'),
                showPoliticas: () => setModal('politicas')
              }}>
                <Register onShowLogin={() => setModal('login')} />
              </ModalProvider>
            ) : modal === 'terminos' ? (
              <div className="encabezado__modal-content">
                <TerminosyCondiciones isModal={true} />
              </div>
            ) : modal === 'politicas' ? (
              <div className="encabezado__modal-content">
                <PoliticasPrivacidad isModal={true} />
              </div>
            ) : (
              <div className="encabezado__modal-monedas">
                <h2>Recargar MONEDAS</h2>
                <div className="encabezado__modal-saldo">Tu saldo:</div>
                <div className="encabezado__modal-saldo-row">
                  <span><BunnySVG className="bunny-anim" /></span>
                  <span>{saldoMonedas}</span>
                </div>
                <div className="encabezado__modal-monedas-grid">
                  {recargaMonedasOpciones.map((op, i) => (
                    <div key={i} className="encabezado__modal-monedas-opcion" onClick={() => {/* ... */}}>
                      <span><BunnySVG className="bunny-anim" /></span>
                      <div>{op.cantidad} MONEDAS</div>
                      <div className="encabezado__modal-monedas-precio">{op.precio}</div>
                    </div>
                  ))}
                </div>
                <div className="encabezado__modal-monedas-info">
                  Todos los precios se muestran en <b>USD</b> (dólar de Estados Unidos)
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default Encabezado;


