import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Regalo } from "../types/regalos";
import { REGALOS_PREDETERMINADOS } from "../types/regalos";
import BunnySVG from "../componentes/Icons/BunnySVG";
import {
  obtenerRegalosDeStreamer,
  crearRegalo,
  editarRegalo,
  eliminarRegalo,
  puedeCrearMasRegalos,
} from "../utils/regalos";
import "../Styles/PanelRegalosStreamer.css";

const PanelRegalosStreamer: React.FC = () => {
  const navigate = useNavigate();
  const [regalosPersonalizados, setRegalosPersonalizados] = useState<Regalo[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [regaloEditando, setRegaloEditando] = useState<Regalo | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  // Formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [puntos, setPuntos] = useState("");

  // Obtener ID del streamer actual
  const obtenerStreamerId = (): string => {
    const usuarioStr = sessionStorage.getItem("USUARIO");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      return usuario.username || "default";
    }
    return "default";
  };

  const cargarRegalos = () => {
    const streamerId = obtenerStreamerId();
    console.log('📦 Cargando regalos para streamer:', streamerId);
    const regalos = obtenerRegalosDeStreamer(streamerId);
    console.log('📦 Regalos personalizados encontrados:', regalos);
    setRegalosPersonalizados(regalos);
  };

  useEffect(() => {
    cargarRegalos();
  }, []);

  const mostrarMensaje = (texto: string, tipo: "success" | "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 3000);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setImagenUrl("");
    setPuntos("");
    setModoEdicion(false);
    setRegaloEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const precioNum = parseFloat(precio);
    const puntosNum = parseFloat(puntos);

    if (!nombre || !imagenUrl || isNaN(precioNum) || isNaN(puntosNum)) {
      mostrarMensaje("Por favor completa todos los campos correctamente", "error");
      return;
    }

    if (modoEdicion && regaloEditando) {
      // Editar regalo existente
      const exito = editarRegalo(regaloEditando.id, nombre, precioNum, imagenUrl, puntosNum);
      if (exito) {
        mostrarMensaje("Regalo actualizado exitosamente", "success");
        cargarRegalos();
        limpiarFormulario();
      } else {
        mostrarMensaje("Error al actualizar el regalo", "error");
      }
    } else {
      // Crear nuevo regalo
      const streamerId = obtenerStreamerId();
      
      if (!puedeCrearMasRegalos(streamerId)) {
        mostrarMensaje("Has alcanzado el límite de regalos personalizados (20)", "error");
        return;
      }

      const nuevoRegalo = crearRegalo(nombre, precioNum, imagenUrl, puntosNum, streamerId);
      console.log('✅ Regalo creado:', nuevoRegalo);
      if (nuevoRegalo) {
        mostrarMensaje("Regalo creado exitosamente", "success");
        cargarRegalos();
        limpiarFormulario();
      } else {
        mostrarMensaje("Error al crear el regalo", "error");
      }
    }
  };

  const handleEditar = (regalo: Regalo) => {
    setRegaloEditando(regalo);
    setNombre(regalo.nombre);
    setPrecio(regalo.precio.toString());
    setImagenUrl(regalo.imagenUrl || "");
    setPuntos(regalo.puntos.toString());
    setModoEdicion(true);
  };

  const handleEliminar = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este regalo?")) {
      const exito = eliminarRegalo(id);
      if (exito) {
        mostrarMensaje("Regalo eliminado exitosamente", "success");
        cargarRegalos();
      } else {
        mostrarMensaje("Error al eliminar el regalo", "error");
      }
    }
  };

  const handleCancelar = () => {
    limpiarFormulario();
  };

  return (
    <div className="panel-regalos-container">
      <aside className="panel-regalos__sidebar panel-regalos__sidebar--left">
        <div className="sidebar-card">
          <h3>📊 Estadísticas</h3>
          <div className="stat-item">
            <span className="stat-label">Regalos Predeterminados</span>
            <span className="stat-value">{REGALOS_PREDETERMINADOS.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Regalos Personalizados</span>
            <span className="stat-value">{regalosPersonalizados.length}/20</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total de Regalos</span>
            <span className="stat-value">{REGALOS_PREDETERMINADOS.length + regalosPersonalizados.length}</span>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>💡 Consejos</h3>
          <ul className="tips-list">
            <li>Usa imágenes con fondo transparente (PNG)</li>
            <li>Tamaño recomendado: 128x128px</li>
            <li>Precios entre 50-1000 monedas</li>
            <li>Los puntos motivan a tus espectadores</li>
          </ul>
        </div>
      </aside>

      <div className="panel-regalos-streamer">
        <div className="panel-regalos__header">
          <button 
            className="panel-regalos__back-btn"
            onClick={() => navigate(-1)}
            title="Volver atrás"
          >
            ← Volver
          </button>
          <h2>Gestión de Regalos</h2>
        </div>
        
        {mensaje && (
          <div className={`panel-regalos__mensaje panel-regalos__mensaje--${tipoMensaje}`}>
            {mensaje}
          </div>
        )}

      {/* Formulario de crear/editar */}
      <div className="panel-regalos__formulario">
        <h3>{modoEdicion ? "Editar Regalo" : "Crear Nuevo Regalo"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Regalo:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Super Regalo"
              maxLength={30}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagenUrl">URL de la Imagen del Regalo:</label>
            <input
              type="url"
              id="imagenUrl"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.png"
              required
            />
            <small style={{ color: '#a0aec0', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Tamaño recomendado: 128x128px (formato: PNG, JPG, GIF)
            </small>
            {imagenUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={imagenUrl} 
                  alt="Vista previa" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #0f3460',
                    background: '#1a1a2e'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio (monedas):</label>
              <input
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="100"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="puntos">Puntos que otorga:</label>
              <input
                type="number"
                id="puntos"
                value={puntos}
                onChange={(e) => setPuntos(e.target.value)}
                placeholder="100"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {modoEdicion ? "Actualizar Regalo" : "Crear Regalo"}
            </button>
            {modoEdicion && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de regalos predeterminados */}
      <div className="panel-regalos__seccion">
        <h3>🎁 Regalos Predeterminados</h3>
        <p className="seccion-descripcion">Estos regalos están disponibles para todos los streamers</p>
        <div className="regalos-grid">
          {REGALOS_PREDETERMINADOS.map((regalo) => (
            <div key={regalo.id} className="regalo-card regalo-card--predeterminado">
              <div className="regalo-emoji">{regalo.emoji}</div>
              <div className="regalo-info">
                <h4>{regalo.nombre}</h4>
                <p>Precio: {regalo.precio} <BunnySVG width={16} height={16} /></p>
                <p>Puntos: {regalo.puntos} ⭐</p>
              </div>
              <div className="regalo-badge">Predeterminado</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de regalos personalizados */}
      <div className="panel-regalos__seccion">
        <h3>✨ Mis Regalos Personalizados</h3>
        <p className="seccion-descripcion">
          Regalos creados por ti ({regalosPersonalizados.length}/20)
        </p>
        {regalosPersonalizados.length === 0 ? (
          <p className="sin-regalos">
            Aún no has creado regalos personalizados. ¡Crea uno arriba!
          </p>
        ) : (
          <div className="regalos-grid">
            {regalosPersonalizados.map((regalo) => (
              <div key={regalo.id} className="regalo-card regalo-card--personalizado">
                <div className="regalo-imagen">
                  {regalo.imagenUrl && (
                    <img 
                      src={regalo.imagenUrl} 
                      alt={regalo.nombre}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="50" font-size="48">🎁</text></svg>';
                      }}
                    />
                  )}
                </div>
                <div className="regalo-info">
                  <h4>{regalo.nombre}</h4>
                  <p>Precio: {regalo.precio} <BunnySVG width={16} height={16} /></p>
                  <p>Puntos: {regalo.puntos} ⭐</p>
                </div>
                <div className="regalo-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleEditar(regalo)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleEliminar(regalo.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <aside className="panel-regalos__sidebar panel-regalos__sidebar--right">
      <div className="sidebar-card">
        <h3>🎯 Capacidad</h3>
        <div className="capacity-bar">
          <div 
            className="capacity-fill" 
            style={{ width: `${(regalosPersonalizados.length / 20) * 100}%` }}
          ></div>
        </div>
        <p className="capacity-text">{regalosPersonalizados.length} de 20 regalos creados</p>
      </div>

      <div className="sidebar-card">
        <h3>🔥 Populares</h3>
        <div className="popular-gifts">
          {REGALOS_PREDETERMINADOS.slice(0, 4).map((regalo) => (
            <div key={regalo.id} className="popular-item">
              <span className="popular-emoji">{regalo.emoji}</span>
              <div className="popular-info">
                <span className="popular-name">{regalo.nombre}</span>
                <span className="popular-price">{regalo.precio} <BunnySVG width={14} height={14} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-card">
        <h3>ℹ️ Información</h3>
        <p className="info-text">
          Los regalos personalizados aparecerán en una sección especial para tus espectadores.
        </p>
        <p className="info-text">
          Asegúrate de que las imágenes sean claras y representen bien el regalo.
        </p>
      </div>
    </aside>
  </div>
  );
};

export default PanelRegalosStreamer;
