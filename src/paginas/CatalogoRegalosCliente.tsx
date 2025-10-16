
import React, { useState, useEffect } from "react";
import { AccionesPuntos } from "../utils/puntos";
import "../Styles/CatalogoRegalos.css";

// Componente de icono de conejo para las monedas con animación
const ConejoMoneda = ({ className = "", size = "20", animate = false }: { className?: string, size?: string, animate?: boolean }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: animate ? 'bounce 2s infinite, glow 2s ease-in-out infinite alternate' : 'none',
      filter: animate ? 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.6))' : 'none'
    }}
  >
    <style>
      {`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes glow {
          from {
            filter: drop-shadow(0 0 5px rgba(0, 191, 255, 0.5));
          }
          to {
            filter: drop-shadow(0 0 15px rgba(0, 191, 255, 0.8));
          }
        }
        
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(-3deg); }
          20% { transform: rotate(3deg); }
          30% { transform: rotate(-3deg); }
          40% { transform: rotate(3deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}
    </style>
    <g style={{ animation: animate ? 'wiggle 3s ease-in-out infinite' : 'none' }}>
      <ellipse cx="14" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="26" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="20" cy="22" rx="10" ry="10" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="20" cy="26" rx="2" ry="1.2" fill="#fff" />
      <ellipse cx="16" cy="22" rx="1" ry="1.5" fill="#fff" />
      <ellipse cx="24" cy="22" rx="1" ry="1.5" fill="#fff" />
      <path d="M18 28 Q20 30 22 28" stroke="#fff" strokeWidth="1.5" fill="none" />
      <g>
        <polyline points="7,10 12,13 9,17" stroke="#fff200" strokeWidth="2" fill="none" />
        <polyline points="33,10 28,13 31,17" stroke="#fff200" strokeWidth="2" fill="none" />
        <polyline points="20,2 18,7 22,7" stroke="#fff200" strokeWidth="2" fill="none" />
      </g>
    </g>
  </svg>
);


const REGALOS = [
  { nombre: "Estrella", precio: 5, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Corazón", precio: 10, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Confeti", precio: 25, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Fuego", precio: 50, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Diamante", precio: 100, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Corona", precio: 200, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Cohete", precio: 500, emoji: <ConejoMoneda size="24" animate={true} /> },
  { nombre: "Diana", precio: 1000, emoji: <ConejoMoneda size="24" animate={true} /> },
];

const PAQUETES_MONEDAS = [
  { cantidad: 100, precio: 1.99 },
  { cantidad: 250, precio: 4.99 },
  { cantidad: 500, precio: 9.99 },
  { cantidad: 1000, precio: 19.99 },
  { cantidad: 2500, precio: 49.99 },
  { cantidad: 5000, precio: 99.99 },
];

const CatalogoRegalosCliente: React.FC = () => {
  const [saldo, setSaldo] = useState(0);

  
  // Estados para recarga personalizada
  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [modoPersonalizado, setModoPersonalizado] = useState(false);

  // Estado para notificaciones elegantes
  const [notificacion, setNotificacion] = useState<{
    tipo: 'success' | 'error' | 'warning' | 'info';
    mensaje: string;
    visible: boolean;
  }>({
    tipo: 'info',
    mensaje: '',
    visible: false
  });

  // Función para mostrar notificaciones elegantes
  const mostrarNotificacion = (tipo: 'success' | 'error' | 'warning' | 'info', mensaje: string) => {
    setNotificacion({
      tipo,
      mensaje,
      visible: true
    });
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      setNotificacion(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Verificar usuario registrado
  const verificarUsuario = () => {
    return sessionStorage.getItem('USUARIO') !== null;
  };

  // Sincronizar saldo con sessionStorage en tiempo real
  const actualizarSaldo = () => {
    if (verificarUsuario()) {
      const usuarioStr = sessionStorage.getItem('USUARIO');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        setSaldo(usuario.monedas ?? 0);
      }
    } else {
      setSaldo(0);
    }
  };

  useEffect(() => {
    actualizarSaldo();
    // Actualizar cada segundo para mantener saldo en tiempo real
    const interval = setInterval(actualizarSaldo, 1000);
    window.addEventListener("storage", actualizarSaldo);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", actualizarSaldo);
    };
  }, []);

  const handleDonar = (precio: number, nombre: string) => {
    // Obtener usuario actual
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) {
      mostrarNotificacion('error', 'No hay usuario activo');
      return;
    }
    const usuario = JSON.parse(usuarioStr);
    const saldoActual = usuario.monedas ?? 1000;
    if (saldoActual < precio) {
      mostrarNotificacion('warning', 'No tienes suficientes monedas');
      return;
    }
    // Restar monedas y sumar puntos
    const nuevasMonedas = saldoActual - precio;
    const puntosActuales = usuario.puntos ?? 0;
    const nuevosPuntos = puntosActuales + (AccionesPuntos.DONAR || 50);
    // Guardar ambos campos juntos
    const nuevoUsuario = { ...usuario, monedas: nuevasMonedas, puntos: nuevosPuntos };
    sessionStorage.setItem('USUARIO', JSON.stringify(nuevoUsuario));
    // Si está registrado, actualizar localStorage también
    const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
    if (registradoStr) {
      const registrado = JSON.parse(registradoStr);
      if (registrado.username === usuario.username) {
        localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify({
          ...registrado,
          monedas: nuevasMonedas,
          puntos: nuevosPuntos
        }));
      }
    }
    window.dispatchEvent(new Event('monedas-actualizadas'));
    mostrarNotificacion('success', `¡Has enviado ${nombre}!`);
    actualizarSaldo();
  };

  // Función para abrir modal de recarga (solo usuarios registrados)
  const abrirRecarga = () => {
    if (!verificarUsuario()) {
      mostrarNotificacion('error', 'Debes iniciar sesión para recargar monedas');
      return;
    }
    setMostrarModalRecarga(true);
  };

  // Función para procesar recarga personalizada
  const procesarRecarga = () => {
    if (!verificarUsuario()) {
      mostrarNotificacion('error', 'Debes iniciar sesión para recargar');
      return;
    }

    const cantidad = parseInt(cantidadPersonalizada);
    if (!cantidad || cantidad <= 0) {
      mostrarNotificacion('warning', 'Ingresa una cantidad válida');
      return;
    }

    if (!metodoPago) {
      mostrarNotificacion('warning', 'Selecciona un método de pago');
      return;
    }

    // Actualizar monedas del usuario
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const nuevoSaldo = (usuario.monedas ?? 0) + cantidad;
      const usuarioActualizado = { ...usuario, monedas: nuevoSaldo };
      sessionStorage.setItem('USUARIO', JSON.stringify(usuarioActualizado));
      
      // También actualizar localStorage si existe
      const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
      if (registradoStr) {
        const registrado = JSON.parse(registradoStr);
        if (registrado.username === usuario.username) {
          localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify({
            ...registrado,
            monedas: nuevoSaldo
          }));
        }
      }

      actualizarSaldo();
      mostrarNotificacion('success', `¡Recarga exitosa! Agregaste ${cantidad} monedas`);
      
      // Cerrar modal y limpiar
      setMostrarModalRecarga(false);
      setCantidadPersonalizada("");
      setMetodoPago("");
      setModoPersonalizado(false);
    }
  };

  return (
    <>
      <div className="catalogo-regalos-cliente">
      <h2>Catálogo de Regalos</h2>
      <div className="catalogo-regalos__saldo">
        <b style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Tus monedas: {saldo} <ConejoMoneda size="18" animate={true} />
        </b>
        <button 
          onClick={abrirRecarga}
          style={{
            marginLeft: "15px",
            padding: "10px 25px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          ✏️ ESCRIBIR MI CANTIDAD PERSONALIZADA
        </button>
      </div>

      <div className="catalogo-regalos__grid">
        {REGALOS.map((regalo) => (
          <div key={regalo.nombre} className="catalogo-regalos__item">
            <div className="catalogo-regalos__emoji">{regalo.emoji}</div>
            <div className="catalogo-regalos__nombre">{regalo.nombre}</div>
            <button
              className={`catalogo-regalos__button ${saldo >= regalo.precio ? 'catalogo-regalos__button--active' : 'catalogo-regalos__button--disabled'}`}
              disabled={saldo < regalo.precio}
              onClick={() => handleDonar(regalo.precio, regalo.nombre)}
            >
              {regalo.precio} 🪙
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Recarga Personalizada */}
      {mostrarModalRecarga && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "30px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center"
          }}>
            <h3>💰 Recargar Monedas</h3>
            
            {/* Selector de modo */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
              <button
                onClick={() => setModoPersonalizado(false)}
                style={{
                  padding: "10px 20px",
                  border: !modoPersonalizado ? "2px solid #4CAF50" : "2px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: !modoPersonalizado ? "#e8f5e8" : "white",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                📦 Paquetes
              </button>
              <button
                onClick={() => setModoPersonalizado(true)}
                style={{
                  padding: "10px 20px",
                  border: modoPersonalizado ? "2px solid #FF5722" : "2px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: modoPersonalizado ? "#fff3e0" : "white",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ✏️ Poner Mi Monto
              </button>
            </div>

            {/* Contenido condicional */}
            {!modoPersonalizado ? (
              // Mostrar paquetes predefinidos
              <div>
                <h4>Selecciona un paquete:</h4>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(2, 1fr)", 
                  gap: "10px",
                  margin: "15px 0" 
                }}>
                  {PAQUETES_MONEDAS.map((paquete, index) => (
                    <button
                      key={index}
                      onClick={() => setCantidadPersonalizada(paquete.cantidad.toString())}
                      style={{
                        padding: "15px",
                        border: cantidadPersonalizada === paquete.cantidad.toString() ? "3px solid #4CAF50" : "2px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: cantidadPersonalizada === paquete.cantidad.toString() ? "#e8f5e8" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        💰 {paquete.cantidad}
                      </div>
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        ${paquete.precio}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Mostrar input personalizado
              <div style={{
                backgroundColor: "#fff3e0",
                padding: "20px",
                borderRadius: "8px",
                margin: "15px 0",
                border: "2px solid #FF5722"
              }}>
                <h4 style={{ margin: "0 0 15px 0", color: "#E65100" }}>
                  ✏️ Escribe tu cantidad personalizada:
                </h4>
                <input
                  type="number"
                  value={cantidadPersonalizada}
                  onChange={(e) => setCantidadPersonalizada(e.target.value)}
                  placeholder="Escribe cualquier cantidad: 50, 150, 2000..."
                  min="1"
                  max="50000"
                  style={{
                    width: "100%",
                    padding: "15px",
                    margin: "10px 0",
                    border: "3px solid #FF5722",
                    borderRadius: "8px",
                    fontSize: "18px",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                />
                <p style={{ 
                  margin: "10px 0 0 0", 
                  fontSize: "14px", 
                  color: "#E65100",
                  fontWeight: "bold",
                  textAlign: "center"
                }}>
                  💡 Desde 1 hasta 50,000 monedas
                </p>
              </div>
            )}
            
            <h4>Método de Pago:</h4>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "15px 0" }}>
              {["💳 Tarjeta", "📱 PayPal", "🏦 Transferencia"].map((metodo) => (
                <button
                  key={metodo}
                  onClick={() => setMetodoPago(metodo)}
                  style={{
                    padding: "8px 15px",
                    border: metodoPago === metodo ? "2px solid #4CAF50" : "2px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: metodoPago === metodo ? "#e8f5e8" : "white",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  {metodo}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={() => {
                  setMostrarModalRecarga(false);
                  setCantidadPersonalizada("");
                  setMetodoPago("");
                  setModoPersonalizado(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={procesarRecarga}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ✅ Confirmar Recarga
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Notificación elegante */}
      {notificacion.visible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            maxWidth: '400px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: notificacion.tipo === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                       notificacion.tipo === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                       notificacion.tipo === 'warning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                       'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transform: 'translateX(0)',
            animation: 'slideInFromRight 0.4s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '1.4'
          }}
        >
          <span style={{ fontSize: '18px' }}>
            {notificacion.tipo === 'success' ? '✅' : 
             notificacion.tipo === 'error' ? '❌' : 
             notificacion.tipo === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span>{notificacion.mensaje}</span>
        </div>
      )}

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default CatalogoRegalosCliente;
