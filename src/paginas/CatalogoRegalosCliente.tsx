
import React, { useState, useEffect } from "react";
import { AccionesPuntos } from "../utils/puntos";
import "../Styles/CatalogoRegalos.css";


const REGALOS = [
  { nombre: "Estrella", precio: 5, emoji: "🪙" },
  { nombre: "Corazón", precio: 10, emoji: "🪙" },
  { nombre: "Confeti", precio: 25, emoji: "🪙" },
  { nombre: "Fuego", precio: 50, emoji: "🪙" },
  { nombre: "Diamante", precio: 100, emoji: "🪙" },
  { nombre: "Corona", precio: 200, emoji: "🪙" },
  { nombre: "Cohete", precio: 500, emoji: "🪙" },
  { nombre: "Diana", precio: 1000, emoji: "🪙" },
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
  const [mensaje, setMensaje] = useState("");
  
  // Estados para recarga personalizada
  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [modoPersonalizado, setModoPersonalizado] = useState(false);

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
      setMensaje("No hay usuario activo");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    const usuario = JSON.parse(usuarioStr);
    const saldoActual = usuario.monedas ?? 1000;
    if (saldoActual < precio) {
      setMensaje("No tienes suficientes monedas");
      setTimeout(() => setMensaje(""), 2000);
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
    setMensaje(`¡Has enviado ${nombre}!`);
    actualizarSaldo();
    setTimeout(() => setMensaje(""), 2000);
  };

  // Función para abrir modal de recarga (solo usuarios registrados)
  const abrirRecarga = () => {
    if (!verificarUsuario()) {
      setMensaje("Debes iniciar sesión para recargar monedas");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }
    setMostrarModalRecarga(true);
  };

  // Función para procesar recarga personalizada
  const procesarRecarga = () => {
    if (!verificarUsuario()) {
      setMensaje("Debes iniciar sesión para recargar");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    const cantidad = parseInt(cantidadPersonalizada);
    if (!cantidad || cantidad <= 0) {
      setMensaje("Ingresa una cantidad válida");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    if (!metodoPago) {
      setMensaje("Selecciona un método de pago");
      setTimeout(() => setMensaje(""), 3000);
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
      setMensaje(`¡Recarga exitosa! Agregaste ${cantidad} monedas`);
      setTimeout(() => setMensaje(""), 3000);
      
      // Cerrar modal y limpiar
      setMostrarModalRecarga(false);
      setCantidadPersonalizada("");
      setMetodoPago("");
      setModoPersonalizado(false);
    }
  };

  return (
    <div className="catalogo-regalos-cliente">
      <h2>Catálogo de Regalos</h2>
      <div className="catalogo-regalos__saldo">
        <b>Tus monedas: {saldo} 🪙</b>
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
      {mensaje && <div className={`catalogo-regalos__mensaje ${saldo < 0 ? 'catalogo-regalos__mensaje--error' : 'catalogo-regalos__mensaje--success'}`}>{mensaje}</div>}
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
  );
};

export default CatalogoRegalosCliente;
