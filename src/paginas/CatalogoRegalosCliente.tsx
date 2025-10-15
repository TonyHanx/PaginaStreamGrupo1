
import React, { useState, useEffect } from "react";
import { obtenerMonedasUsuario } from "../utils/monedas";
import { AccionesPuntos } from "../utils/puntos";


const REGALOS = [
  { nombre: "Estrella", precio: 5, emoji: "⭐" },
  { nombre: "Corazón", precio: 10, emoji: "💖" },
  { nombre: "Confeti", precio: 25, emoji: "🎉" },
  { nombre: "Fuego", precio: 50, emoji: "🔥" },
  { nombre: "Diamante", precio: 100, emoji: "💎" },
  { nombre: "Corona", precio: 200, emoji: "👑" },
  { nombre: "Cohete", precio: 500, emoji: "🚀" },
  { nombre: "Diana", precio: 1000, emoji: "🎯" },
];

const CatalogoRegalosCliente: React.FC = () => {
  const [saldo, setSaldo] = useState(0);
  const [mensaje, setMensaje] = useState("");

  // Sincronizar saldo con sessionStorage
  const actualizarSaldo = () => {
    const datos = obtenerMonedasUsuario();
    setSaldo(datos?.monedas ?? 0);
  };

  useEffect(() => {
    actualizarSaldo();
    window.addEventListener("storage", actualizarSaldo);
    return () => window.removeEventListener("storage", actualizarSaldo);
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

  return (
    <div className="catalogo-regalos-cliente" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Catálogo de Regalos</h2>
      <div style={{ background: "#0a2a3a", color: "#fff", borderRadius: 10, padding: 12, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
        <span role="img" aria-label="moneda">🪙</span>
        <b>Tus monedas: {saldo}</b>
      </div>
      {mensaje && <div style={{ color: saldo < 0 ? "#f87171" : "#00bfff", marginBottom: 10 }}>{mensaje}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {REGALOS.map((regalo) => (
          <div key={regalo.nombre} style={{ background: "#181b1f", borderRadius: 12, padding: 16, textAlign: "center", color: "#fff", boxShadow: "0 2px 8px #0002" }}>
            <div style={{ fontSize: 32 }}>{regalo.emoji}</div>
            <div style={{ fontWeight: 600, margin: "8px 0" }}>{regalo.nombre}</div>
            <button
              style={{
                background: saldo >= regalo.precio ? "#00bfff" : "#444",
                color: saldo >= regalo.precio ? "#111" : "#aaa",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                cursor: saldo >= regalo.precio ? "pointer" : "not-allowed",
                marginTop: 6
              }}
              disabled={saldo < regalo.precio}
              onClick={() => handleDonar(regalo.precio, regalo.nombre)}
            >
              {regalo.precio} 🪙
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoRegalosCliente;
