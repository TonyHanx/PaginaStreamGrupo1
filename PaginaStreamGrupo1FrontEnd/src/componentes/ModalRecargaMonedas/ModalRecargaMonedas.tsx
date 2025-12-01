import React, { useState, useEffect } from 'react';
import { obtenerMonedasUsuario, agregarMonedas } from '../../utils/monedas';
import { syncTransactions } from '../../services/transactionService';
import BunnySVG from '../Icons/BunnySVG';
import './ModalRecargaMonedas.css';

type CompraSeleccionada = {
  monedas: number;
  usd: number;
};

const TASA_CAMBIO = 95; // 1 USD = 95 monedas

const ModalRecargaMonedas: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [tabActiva, setTabActiva] = useState<'paquetes' | 'personalizado'>('paquetes');
  const [mostrarPasarela, setMostrarPasarela] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState<CompraSeleccionada | null>(null);

  // estados para monto personalizado
  const [montoUsd, setMontoUsd] = useState<string>('');
  const [cantidadMonedasPers, setCantidadMonedasPers] = useState<string>('');

  useEffect(() => {
    const actualizarSaldo = () => {
      const datos = obtenerMonedasUsuario();
      setSaldo(datos?.monedas ?? 0);
    };

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

  const opciones = [
    { cantidad: 100, precioTexto: '1,09 US$', precioUsd: 1.09 },
    { cantidad: 250, precioTexto: '2,69 US$', precioUsd: 2.69 },
    { cantidad: 500, precioTexto: '5,29 US$', precioUsd: 5.29 },
    { cantidad: 1000, precioTexto: '10,55 US$', precioUsd: 10.55 },
    { cantidad: 2500, precioTexto: '26,35 US$', precioUsd: 26.35 },
    { cantidad: 5000, precioTexto: '52,69 US$', precioUsd: 52.69 },
    { cantidad: 10000, precioTexto: '105,29 US$', precioUsd: 105.29 },
  ];

  const abrirPasarela = (monedas: number, usd: number) => {
    setCompraSeleccionada({ monedas, usd });
    setMostrarPasarela(true);
  };

  const handleConfirmarPago = async () => {
    if (!compraSeleccionada) return;
    const exito = await agregarMonedas(compraSeleccionada.monedas);
    if (exito) {
      // Sincronizar transacciones con el backend
      await syncTransactions();
      
      setSaldo((prev) => prev + compraSeleccionada.monedas);
      setMostrarPasarela(false);
      setMostrarModal(false);
    } else {
      alert('Error al procesar la compra. Intenta nuevamente.');
    }
  };

  const handleCancelarPasarela = () => {
    setMostrarPasarela(false);
  };

  const handlePersonalizadaPorUsd = () => {
    const usd = parseFloat(montoUsd.replace(',', '.'));
    if (isNaN(usd) || usd <= 0) return;
    const monedas = Math.round(usd * TASA_CAMBIO);
    abrirPasarela(monedas, usd);
  };

  const handlePersonalizadaPorMonedas = () => {
    const monedas = parseInt(cantidadMonedasPers, 10);
    if (isNaN(monedas) || monedas <= 0) return;
    const usd = +(monedas / TASA_CAMBIO).toFixed(2);
    abrirPasarela(monedas, usd);
  };

  if (!mostrarModal) return null;

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <div className="modal-recarga-overlay" onClick={() => setMostrarModal(false)}>
        <div
          className="modal-recarga-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-recarga-close"
            onClick={() => setMostrarModal(false)}
          >
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

          {/* PESTAÑAS */}
          <div className="modal-recarga-tabs">
            <button
              className={`modal-recarga-tab ${
                tabActiva === 'paquetes' ? 'activo' : ''
              }`}
              onClick={() => setTabActiva('paquetes')}
            >
              Paquetes predefinidos
            </button>
            <button
              className={`modal-recarga-tab ${
                tabActiva === 'personalizado' ? 'activo' : ''
              }`}
              onClick={() => setTabActiva('personalizado')}
            >
              Monto personalizado
            </button>
          </div>

          {/* CONTENIDO PESTAÑA PAQUETES */}
          {tabActiva === 'paquetes' && (
            <div className="modal-recarga-grid">
              {opciones.map((opcion) => (
                <div
                  key={opcion.cantidad}
                  className="modal-recarga-opcion"
                  onClick={() => abrirPasarela(opcion.cantidad, opcion.precioUsd)}
                >
                  <span>
                    <BunnySVG className="bunny-anim" />
                  </span>
                  <div>{opcion.cantidad} MONEDAS</div>
                  <div className="modal-recarga-precio">
                    {opcion.precioTexto}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CONTENIDO PESTAÑA PERSONALIZADO */}
          {tabActiva === 'personalizado' && (
            <div className="modal-recarga-personalizado">
              <div className="personalizado-bloque">
                <label>Ingresa el monto en USD</label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  placeholder="Ej: 5.50"
                  value={montoUsd}
                  onChange={(e) => setMontoUsd(e.target.value)}
                />
                <button onClick={handlePersonalizadaPorUsd}>
                  Recargar con ${montoUsd || '0.00'} USD
                </button>
              </div>

              <div className="personalizado-separador">o</div>

              <div className="personalizado-bloque">
                <label>Especifica cantidad de monedas</label>
                <input
                  type="number"
                  min={TASA_CAMBIO}
                  step={TASA_CAMBIO}
                  placeholder="Ej: 500"
                  value={cantidadMonedasPers}
                  onChange={(e) => setCantidadMonedasPers(e.target.value)}
                />
                <button onClick={handlePersonalizadaPorMonedas}>
                  Comprar {cantidadMonedasPers || 0} monedas
                </button>
              </div>

              <div className="personalizado-tasa">
                Tasa de cambio: 1 USD = {TASA_CAMBIO} monedas · Monto mínimo: 1
                USD ({TASA_CAMBIO} monedas)
              </div>
            </div>
          )}

          <div className="modal-recarga-info">
            Todos los precios se muestran en <b>USD</b> (dólar de Estados Unidos)
          </div>
        </div>
      </div>

      {/* MODAL PASARELA DE PAGO */}
      {mostrarPasarela && compraSeleccionada && (
        <div className="modal-pago-overlay" onClick={handleCancelarPasarela}>
          <div
            className="modal-pago-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-recarga-close"
              onClick={handleCancelarPasarela}
            >
              &times;
            </button>

            <h2>Completa tu compra</h2>

            <div className="pago-resumen">
              <div className="pago-resumen-info">
                <div className="pago-resumen-titulo">
                  {compraSeleccionada.monedas} MONEDAS
                </div>
                <div className="pago-resumen-sub">
                  Paquete de {compraSeleccionada.monedas} MONEDAS · Pago único y
                  no reembolsable
                </div>
              </div>
              <div className="pago-resumen-cantidad">x1</div>
            </div>

            <div className="pago-total">
              <div className="pago-total-monto">
                Monto total a pagar:{' '}
                <span>
                  $
                  {compraSeleccionada.usd.toFixed(2)} USD
                </span>
              </div>
              <div className="pago-total-sub">
                Recarga de saldo de manera segura
              </div>
            </div>

            <div className="pago-metodos-titulo">
              Añadir un nuevo método de pago
            </div>
            <div className="pago-metodos">
              <button className="pago-metodo">Tarjeta</button>
              <button className="pago-metodo">Google Pay</button>
              <button className="pago-metodo">Amazon Pay</button>
              <button className="pago-metodo">Cash App Pay</button>
            </div>

            <div className="pago-acciones">
              <button className="btn-volver" onClick={handleCancelarPasarela}>
                ← Volver
              </button>
              <button className="btn-confirmar" onClick={handleConfirmarPago}>
                Confirmar pago
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalRecargaMonedas;
