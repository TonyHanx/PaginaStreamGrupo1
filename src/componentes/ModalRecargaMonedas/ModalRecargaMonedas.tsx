import React, { useState } from 'react';

interface PaqueteMoneda {
  cantidad: number;
  precio: number;
}

interface ModalRecargaMonedasProps {
  isOpen: boolean;
  onClose: () => void;
  saldoActual: number;
}

const ModalRecargaMonedas: React.FC<ModalRecargaMonedasProps> = ({
  isOpen,
  onClose,
  saldoActual
}) => {
  const [modoPersonalizado, setModoPersonalizado] = useState(false);
  const [montoPersonalizado, setMontoPersonalizado] = useState('');
  const [monedasPersonalizadas, setMonedasPersonalizadas] = useState('');
  const [mostrarPago, setMostrarPago] = useState(false);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<PaqueteMoneda | null>(null);
  const [paqueteBase, setPaqueteBase] = useState<PaqueteMoneda | null>(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [procesandoPago, setProcesandoPago] = useState(false);

  const paquetes: PaqueteMoneda[] = [
    { cantidad: 100, precio: 1.09 },
    { cantidad: 250, precio: 2.69 },
    { cantidad: 500, precio: 5.29 },
    { cantidad: 1000, precio: 10.55 },
    { cantidad: 2500, precio: 26.35 },
    { cantidad: 5000, precio: 52.69 },
    { cantidad: 10000, precio: 105.29 }
  ];

  // Funciones para el modo personalizado
  const calcularMonedas = (monto: number) => Math.floor(monto * 95);
  const calcularPrecio = (monedas: number) => (monedas / 95).toFixed(2);

  const seleccionarPaqueteParaPago = (paquete: PaqueteMoneda) => {
    // Verificar autenticación
    const usuarioLogueado = sessionStorage.getItem('USUARIO');
    if (!usuarioLogueado) {
      alert('Debes iniciar sesión para recargar monedas.');
      return;
    }

    // Guardar paquete base y calcular con cantidad
    setPaqueteBase(paquete);
    const paqueteConCantidad = {
      cantidad: paquete.cantidad * cantidadSeleccionada,
      precio: paquete.precio * cantidadSeleccionada
    };
    setPaqueteSeleccionado(paqueteConCantidad);
    setMostrarPago(true);
  };

  const actualizarCantidad = (nuevaCantidad: number) => {
    setCantidadSeleccionada(nuevaCantidad);
    if (paqueteBase) {
      const paqueteActualizado = {
        cantidad: paqueteBase.cantidad * nuevaCantidad,
        precio: paqueteBase.precio * nuevaCantidad
      };
      setPaqueteSeleccionado(paqueteActualizado);
    }
  };

  const procesarPagoFinal = async (metodoPago: string) => {
    if (!paqueteSeleccionado) return;
    
    setProcesandoPago(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Procesar la recarga
      const usuarioLogueado = sessionStorage.getItem('USUARIO');
      const usuarioData = JSON.parse(usuarioLogueado!);
      const saldoActualNum = usuarioData.monedas || 0;
      const nuevoSaldo = saldoActualNum + paqueteSeleccionado.cantidad;
      
      // Actualizar el usuario en sessionStorage
      const usuarioActualizado = {
        ...usuarioData,
        monedas: nuevoSaldo
      };
      sessionStorage.setItem('USUARIO', JSON.stringify(usuarioActualizado));
      sessionStorage.setItem('saldoMonedas', nuevoSaldo.toString());

      alert(`¡Recarga exitosa! 🎉\n\nMétodo de pago: ${metodoPago}\nSe agregaron ${paqueteSeleccionado.cantidad.toLocaleString()} monedas por $${paqueteSeleccionado.precio.toFixed(2)} USD.\n\nNuevo saldo: ${nuevoSaldo.toLocaleString()} monedas 🪙`);
      
      // Cerrar modal y actualizar interfaz
      cerrarModal();
      window.location.reload();
    } catch (error) {
      alert('Error al procesar el pago. Inténtalo nuevamente.');
    } finally {
      setProcesandoPago(false);
    }
  };

  const volverASeleccion = () => {
    setMostrarPago(false);
    setPaqueteSeleccionado(null);
    setPaqueteBase(null);
    setCantidadSeleccionada(1);
  };

  const cerrarModal = () => {
    setMostrarPago(false);
    setPaqueteSeleccionado(null);
    setPaqueteBase(null);
    setCantidadSeleccionada(1);
    setMontoPersonalizado('');
    setMonedasPersonalizadas('');
    setModoPersonalizado(false);
    onClose();
  };

  const manejarRecargaConMonto = () => {
    const monto = parseFloat(montoPersonalizado);
    if (isNaN(monto) || monto < 1) {
      alert('Por favor ingresa un monto válido (mínimo $1 USD)');
      return;
    }
    
    if (monto > 1000) {
      alert('El monto máximo es de $1000 USD');
      return;
    }

    const cantidadMonedas = calcularMonedas(monto);
    const paquetePersonalizado: PaqueteMoneda = {
      cantidad: cantidadMonedas,
      precio: monto
    };
    
    seleccionarPaqueteParaPago(paquetePersonalizado);
  };

  const manejarRecargaConMonedas = () => {
    const monedas = parseInt(monedasPersonalizadas);
    if (isNaN(monedas) || monedas < 95) {
      alert('Por favor ingresa una cantidad válida (mínimo 95 monedas)');
      return;
    }
    
    if (monedas > 95000) {
      alert('El máximo es de 95,000 monedas');
      return;
    }

    const precio = parseFloat(calcularPrecio(monedas));
    const paquetePersonalizado: PaqueteMoneda = {
      cantidad: monedas,
      precio: precio
    };
    
    seleccionarPaqueteParaPago(paquetePersonalizado);
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const contentStyle = {
    background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    color: 'white'
  };

  return (
    <div style={modalStyle} onClick={(e) => {
      if (e.target === e.currentTarget) {
        cerrarModal();
      }
    }}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2>{mostrarPago ? 'Completa tu compra' : 'Recargar MONEDAS'}</h2>
          <button 
            style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '28px', cursor: 'pointer' }}
            onClick={mostrarPago ? volverASeleccion : cerrarModal}
          >
            ×
          </button>
        </div>

        {mostrarPago ? (
          // Vista de métodos de pago
          <div>
            {paqueteSeleccionado && (
              <div style={{ 
                marginBottom: '25px', 
                padding: '20px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#4CAF50', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    🪙
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {paqueteSeleccionado.cantidad.toLocaleString()} MONEDAS
                    </div>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>
                      paquete de {paqueteSeleccionado.cantidad.toLocaleString()} MONEDAS
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      Este es un pago único y no es reembolsable.
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <select 
                      value={cantidadSeleccionada}
                      onChange={(e) => actualizarCantidad(parseInt(e.target.value))}
                      style={{
                        background: '#444',
                        color: 'white',
                        border: '1px solid #666',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {paqueteSeleccionado && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                background: 'rgba(76, 175, 80, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>
                <div style={{ fontSize: '14px', color: '#4CAF50', marginBottom: '5px' }}>
                  💰 Monto total a pagar: <strong>${paqueteSeleccionado.precio.toFixed(2)} USD</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>
                  RECARGA DE SALDO DE MANERA SEGURA
                </div>
              </div>
            )}

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Añadir un nuevo método de pago</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Tarjeta', icon: '💳', method: 'Tarjeta de Crédito/Débito' },
                  { name: 'Google Pay', icon: '🅖', method: 'Google Pay' },
                  { name: 'Amazon Pay', icon: '📦', method: 'Amazon Pay' },
                  { name: 'Cash App Pay', icon: '💚', method: 'Cash App Pay' }
                ].map((payment, index) => (
                  <button
                    key={index}
                    onClick={() => procesarPagoFinal(payment.method)}
                    disabled={procesandoPago}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      background: '#444',
                      border: '1px solid #666',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: procesandoPago ? 'not-allowed' : 'pointer',
                      opacity: procesandoPago ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!procesandoPago) {
                        e.currentTarget.style.background = '#555';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!procesandoPago) {
                        e.currentTarget.style.background = '#444';
                      }
                    }}
                  >
                    {payment.icon} <span style={{ marginLeft: '15px' }}>{payment.name}</span>
                  </button>
                ))}
              </div>

              {procesandoPago && (
                <div style={{ 
                  marginTop: '20px',
                  textAlign: 'center',
                  padding: '15px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '8px',
                  color: '#4CAF50',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                    🔄 Procesando pago...
                  </div>
                  <div style={{ fontSize: '12px', color: '#81C784' }}>
                    Por favor espera un momento
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={volverASeleccion}
                disabled={procesandoPago}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: procesandoPago ? 'not-allowed' : 'pointer',
                  opacity: procesandoPago ? 0.7 : 1,
                  fontSize: '16px'
                }}
              >
                ← Volver
              </button>
            </div>
          </div>
        ) : (
          // Vista de selección de paquetes (código existente)
          <div>
            <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <span>Tu saldo: 🪙 {saldoActual}</span>
            </div>

            {/* Selector de modo */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => setModoPersonalizado(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: !modoPersonalizado ? '#4CAF50' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  📦 PAQUETES PREDEFINIDOS
                </button>
                <button
                  onClick={() => setModoPersonalizado(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: modoPersonalizado ? '#4CAF50' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  💰 MONTO PERSONALIZADO
                </button>
              </div>
            </div>

            {!modoPersonalizado ? (
              // Modo paquetes predefinidos
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '15px',
                marginBottom: '25px'
              }}>
                {paquetes.map((paquete, index) => (
                  <button 
                    key={index} 
                    style={{
                      background: '#333',
                      border: '2px solid #555',
                      borderRadius: '12px',
                      padding: '20px 15px',
                      textAlign: 'center' as const,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      fontSize: '14px'
                    }}
                    onClick={() => seleccionarPaqueteParaPago(paquete)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#444';
                      e.currentTarget.style.borderColor = '#4CAF50';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#333';
                      e.currentTarget.style.borderColor = '#555';
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🪙</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      {paquete.cantidad.toLocaleString()} MONEDAS
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#4CAF50' }}>
                      ${paquete.precio.toFixed(2)} USD
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Modo personalizado
              <div style={{ marginBottom: '25px' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '20px', 
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ marginBottom: '15px', color: '#4CAF50' }}>💸 Ingresa el monto en USD</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="number"
                      placeholder="Ej: 5.50"
                      value={montoPersonalizado}
                      onChange={(e) => setMontoPersonalizado(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '2px solid #555',
                        background: '#333',
                        color: 'white',
                        boxSizing: 'border-box' as const
                      }}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  {montoPersonalizado && (
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(76, 175, 80, 0.1)', 
                      borderRadius: '5px',
                      marginBottom: '15px'
                    }}>
                      <span style={{ color: '#4CAF50' }}>
                        💰 Recibirás: <strong>{calcularMonedas(parseFloat(montoPersonalizado) || 0).toLocaleString()} monedas</strong>
                      </span>
                    </div>
                  )}
                  <button
                    onClick={manejarRecargaConMonto}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                  >
                    💳 Recargar con ${montoPersonalizado || '0.00'} USD
                  </button>
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '20px', 
                  borderRadius: '10px'
                }}>
                  <h4 style={{ marginBottom: '15px', color: '#FF9800' }}>🪙 O especifica cantidad de monedas</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="number"
                      placeholder="Ej: 500"
                      value={monedasPersonalizadas}
                      onChange={(e) => setMonedasPersonalizadas(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '2px solid #555',
                        background: '#333',
                        color: 'white',
                        boxSizing: 'border-box' as const
                      }}
                      min="1"
                    />
                  </div>
                  {monedasPersonalizadas && (
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(255, 152, 0, 0.1)', 
                      borderRadius: '5px',
                      marginBottom: '15px'
                    }}>
                      <span style={{ color: '#FF9800' }}>
                        💵 Costo: <strong>${calcularPrecio(parseInt(monedasPersonalizadas) || 0)} USD</strong>
                      </span>
                    </div>
                  )}
                  <button
                    onClick={manejarRecargaConMonedas}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                  >
                    🪙 Comprar {monedasPersonalizadas || '0'} monedas
                  </button>
                </div>

                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  background: 'rgba(33, 150, 243, 0.1)', 
                  borderRadius: '5px',
                  fontSize: '12px',
                  color: '#2196F3'
                }}>
                  ℹ️ <strong>Tasa de cambio:</strong> 1 USD = 95 monedas | Monto mínimo: $1 USD (95 monedas)
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '20px' }}>
              🔒 Todos los precios se muestran en <strong>USD</strong> (dólar de Estados Unidos)<br/>
              ⚡ Las monedas se añaden instantáneamente a tu cuenta
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalRecargaMonedas;