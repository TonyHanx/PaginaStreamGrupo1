import React, { useState, useEffect } from "react";
import type { Regalo } from "../types/regalos";
import { obtenerTodosLosRegalos } from "../utils/regalos";
import { obtenerMonedasUsuario, gastarMonedas } from "../utils/monedas";
import { AccionesPuntos } from "../utils/puntos";
import "../Styles/CatalogoRegalos.css";

const CatalogoRegalosCliente: React.FC = () => {
  const [saldo, setSaldo] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [regalos, setRegalos] = useState<{ predeterminados: Regalo[], personalizados: Regalo[] }>({
    predeterminados: [],
    personalizados: []
  });

  // Obtener ID del streamer actual (si estamos viendo un stream específico)
  const obtenerStreamerId = (): string | undefined => {
    // Intentar obtener de diferentes fuentes
    // 1. Si hay un streamer específico guardado
    const streamerActualStr = sessionStorage.getItem('STREAMER_ACTUAL');
    if (streamerActualStr) {
      try {
        return JSON.parse(streamerActualStr).username;
      } catch {}
    }
    
    // 2. Si no, usar el usuario actual (para pruebas)
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr).username;
      } catch {}
    }
    
    return undefined;
  };

  // Sincronizar saldo con sessionStorage
  const actualizarSaldo = () => {
    const datos = obtenerMonedasUsuario();
    setSaldo(datos?.monedas ?? 0);
  };

  // Cargar regalos
  const cargarRegalos = () => {
    const streamerId = obtenerStreamerId();
    const todosLosRegalos = obtenerTodosLosRegalos(streamerId);
    setRegalos(todosLosRegalos);
  };

  // Escuchar cambios de saldo
  useEffect(() => {
    actualizarSaldo();
    cargarRegalos();
    
    const handleSaldoChange = () => actualizarSaldo();
    
    window.addEventListener("storage", handleSaldoChange);
    window.addEventListener("monedas-actualizadas", handleSaldoChange);
    window.addEventListener("saldo-actualizado", handleSaldoChange);
    
    return () => {
      window.removeEventListener("storage", handleSaldoChange);
      window.removeEventListener("monedas-actualizadas", handleSaldoChange);
      window.removeEventListener("saldo-actualizado", handleSaldoChange);
    };
  }, []);

  const handleDonar = (precio: number, nombre: string, puntos: number) => {
    const datosUsuario = obtenerMonedasUsuario();
    if (!datosUsuario) {
      setMensaje("No hay usuario activo");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    
    const saldoReal = datosUsuario.monedas;
    if (saldoReal < precio) {
      // Disparar evento para abrir modal de recarga
      window.dispatchEvent(new CustomEvent('abrirTiendaMonedas'));
      return;
    }
    
    // Gastar monedas usando la función centralizada
    const gastadoExitoso = gastarMonedas(precio);
    if (!gastadoExitoso) {
      setMensaje("Error al procesar el regalo");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    
    // Agregar puntos
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const puntosActuales = usuario.puntos ?? 0;
      const nuevosPuntos = puntosActuales + (puntos || AccionesPuntos.DONAR || 50);
      usuario.puntos = nuevosPuntos;
      sessionStorage.setItem('USUARIO', JSON.stringify(usuario));
      
      // Sincronizar localStorage
      const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
      if (registradoStr) {
        const registrado = JSON.parse(registradoStr);
        if (registrado.username === usuario.username) {
          registrado.puntos = nuevosPuntos;
          localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify(registrado));
        }
      }
    }
    
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
      
      {/* Regalos Predeterminados */}
      <div className="catalogo-seccion">
        <h3 className="catalogo-seccion__titulo">🎁 Regalos Predeterminados</h3>
        <div className="catalogo-regalos__grid">
          {regalos.predeterminados.map((regalo) => (
            <div key={regalo.id} className="catalogo-regalos__item catalogo-regalos__item--predeterminado">
              <div className="catalogo-regalos__emoji">{regalo.emoji}</div>
              <div className="catalogo-regalos__nombre">{regalo.nombre}</div>
              <div className="catalogo-regalos__puntos">⭐ {regalo.puntos} pts</div>
              <button
                className={`catalogo-regalos__button ${saldo >= regalo.precio ? 'catalogo-regalos__button--active' : 'catalogo-regalos__button--disabled'}`}
                disabled={saldo < regalo.precio}
                onClick={() => handleDonar(regalo.precio, regalo.nombre, regalo.puntos)}
              >
                {regalo.precio} 🪙
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Regalos Personalizados */}
      {regalos.personalizados.length > 0 && (
        <div className="catalogo-seccion">
          <h3 className="catalogo-seccion__titulo">✨ Regalos Exclusivos del Streamer</h3>
          <div className="catalogo-regalos__grid">
            {regalos.personalizados.map((regalo) => (
              <div key={regalo.id} className="catalogo-regalos__item catalogo-regalos__item--personalizado">
                <div className="catalogo-regalos__badge">Exclusivo</div>
                {regalo.imagenUrl ? (
                  <div className="catalogo-regalos__imagen">
                    <img 
                      src={regalo.imagenUrl} 
                      alt={regalo.nombre}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="50" font-size="48">🎁</text></svg>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="catalogo-regalos__emoji">{regalo.emoji || '🎁'}</div>
                )}
                <div className="catalogo-regalos__nombre">{regalo.nombre}</div>
                <div className="catalogo-regalos__puntos">⭐ {regalo.puntos} pts</div>
                <button
                  className={`catalogo-regalos__button ${saldo >= regalo.precio ? 'catalogo-regalos__button--active' : 'catalogo-regalos__button--disabled'}`}
                  disabled={saldo < regalo.precio}
                  onClick={() => handleDonar(regalo.precio, regalo.nombre, regalo.puntos)}
                >
                  {regalo.precio} 🪙
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoRegalosCliente;
