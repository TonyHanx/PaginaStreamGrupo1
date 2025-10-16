import React, { useState } from 'react';
import './ModalMetodosPago.css';

interface PaqueteMoneda {
  cantidad: number;
  precio: number;
}

interface MetodoPago {
  id: string;
  nombre: string;
  icon: string;
  color: string;
}

interface ModalMetodosPagoProps {
  isOpen: boolean;
  onClose: () => void;
  paqueteSeleccionado: PaqueteMoneda | null;
  onProcesarPago: (metodoPago: string) => void;
}

const ModalMetodosPago: React.FC<ModalMetodosPagoProps> = ({
  isOpen,
  onClose,
  paqueteSeleccionado,
  onProcesarPago
}) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string>('');
  const [establecerPredeterminado, setEstablecerPredeterminado] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);

  const metodosPago: MetodoPago[] = [
    { id: 'tarjeta', nombre: 'Tarjeta', icon: '💳', color: '#6c757d' },
    { id: 'google-pay', nombre: 'Google Pay', icon: 'G', color: '#4285f4' },
    { id: 'amazon-pay', nombre: 'Amazon Pay', icon: 'PAY', color: '#ff9900' },
    { id: 'cash-app', nombre: 'Cash App Pay', icon: '$', color: '#00d632' }
  ];

  const handleProcesarPago = async () => {
    if (!metodoSeleccionado || !paqueteSeleccionado) return;
    
    setProcesandoPago(true);
    
    // Simular procesamiento de pago (2-3 segundos)
    setTimeout(() => {
      onProcesarPago(metodoSeleccionado);
      setProcesandoPago(false);
      onClose();
    }, 2500);
  };

  if (!isOpen || !paqueteSeleccionado) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-metodos-pago">
        <div className="modal-header">
          <h2>Completa tu compra</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Resumen del producto */}
        <div className="resumen-producto">
          <div className="producto-info">
            <div className="producto-header">
              <span className="nombre-producto">Nombre del producto</span>
              <span className="descripcion">Descripción</span>
              <span className="cantidad-header">Cantidad</span>
            </div>
            <div className="producto-detalle">
              <div className="producto-icon">
                <span className="kick-icon">🪙</span>
                <span className="producto-nombre">{paqueteSeleccionado.cantidad} KICKs</span>
              </div>
              <div className="producto-descripcion">
                paquete de {paqueteSeleccionado.cantidad} KICKs<br />
                <small>Este es un pago único y no es reembolsable.</small>
              </div>
              <div className="cantidad-selector">
                <select defaultValue="1">
                  <option value="1">1</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="seccion-metodos-pago">
          <h3>Añadir un nuevo método de pago</h3>
          
          <div className="metodos-lista">
            {metodosPago.map((metodo) => (
              <div
                key={metodo.id}
                className={`metodo-pago-item ${metodoSeleccionado === metodo.id ? 'seleccionado' : ''}`}
                onClick={() => setMetodoSeleccionado(metodo.id)}
              >
                <div className="metodo-icon" style={{ backgroundColor: metodo.color }}>
                  {metodo.icon}
                </div>
                <span className="metodo-nombre">{metodo.nombre}</span>
              </div>
            ))}
          </div>

          <div className="establecer-predeterminado">
            <label>
              <input
                type="checkbox"
                checked={establecerPredeterminado}
                onChange={(e) => setEstablecerPredeterminado(e.target.checked)}
              />
              Establecer como método de pago predeterminado
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="acciones">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={`btn-guardar ${!metodoSeleccionado ? 'deshabilitado' : ''} ${procesandoPago ? 'procesando' : ''}`}
            onClick={handleProcesarPago}
            disabled={!metodoSeleccionado || procesandoPago}
          >
            {procesandoPago ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMetodosPago;