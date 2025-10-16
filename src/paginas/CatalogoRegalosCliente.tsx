
import React, { useState, useEffect } from "react";
import { obtenerMonedasUsuario } from "../utils/monedas";
import { AccionesPuntos } from "../utils/puntos";
import "../Styles/CatalogoRegalos.css";


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
    <div className="catalogo-regalos-cliente">
      <h2>Catálogo de Regalos</h2>
      <div className="catalogo-regalos__saldo">
        <span role="img" aria-label="moneda">🪙</span>
        <b>Tus monedas: {saldo}</b>
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
    </div>
  );
};

export default CatalogoRegalosCliente;
