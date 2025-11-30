import React, { useState, useEffect } from 'react';
import { obtenerMonedasUsuario, agregarMonedas } from '../../utils/monedas';
import BunnySVG from '../Icons/BunnySVG';
import './ModalRecargaMonedas.css';

const ModalRecargaMonedas: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    // Actualizar saldo
    const actualizarSaldo = () => {
      const datos = obtenerMonedasUsuario();
      setSaldo(datos?.monedas ?? 0);
    };

    // Escuchar evento para abrir el modal
    const handleAbrirModal = () => {
      actualizarSaldo();
      setMostrarModal(true);
    };

    window.addEventListener('abrirTiendaMonedas', handleAbrirModal);
    window.addEventListener('monedas-actualizadas', actualizarSaldo);
    window.addEventListener('saldo-actualizado', actualizarSaldo);

    return () => {
      window.removeEventListener('abrirTiendaMonedas', handleAbrirModal);
      window.removeEventListener('monedas-actualizadas', actualizarSaldo);
      window.removeEventListener('saldo-actualizado', actualizarSaldo);
    };
  }, []);

  const handleComprar = (cantidad: number) => {
    agregarMonedas(cantidad);
    setSaldo(prev => prev + cantidad);
    setMostrarModal(false);
  };

  if (!mostrarModal) return null;

  const opciones = [
    { cantidad: 100, precio: '1,09 US$' },
    { cantidad: 250, precio: '2,69 US$' },
    { cantidad: 500, precio: '5,29 US$' },
    { cantidad: 1000, precio: '10,55 US$' },
    { cantidad: 2500, precio: '26,35 US$' },
    { cantidad: 5000, precio: '52,69 US$' },
    { cantidad: 10000, precio: '105,29 US$' },
  ];

  return (
    <div className="modal-recarga-overlay" onClick={() => setMostrarModal(false)}>
      <div className="modal-recarga-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-recarga-close" onClick={() => setMostrarModal(false)}>
          &times;
        </button>
        
        <h2>Recargar MONEDAS</h2>
        
        <div className="modal-recarga-saldo-label">Tu saldo:</div>
        <div className="modal-recarga-saldo-row">
          <span>
            <BunnySVG className="bunny-anim" />
          </span>
          <span>{saldo}</span>
        </div>

        <div className="modal-recarga-grid">
          {opciones.map((opcion) => (
            <div
              key={opcion.cantidad}
              className="modal-recarga-opcion"
              onClick={() => handleComprar(opcion.cantidad)}
            >
              <span>
                <BunnySVG className="bunny-anim" />
              </span>
              <div>{opcion.cantidad} MONEDAS</div>
              <div className="modal-recarga-precio">{opcion.precio}</div>
            </div>
          ))}
        </div>

        <div className="modal-recarga-info">
          Todos los precios se muestran en <b>USD</b> (dólar de Estados Unidos)
        </div>
      </div>
    </div>
  );
};

export default ModalRecargaMonedas;
