import React, { useState } from 'react';

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
  
  // Estados para notificaciones elegantes
  const [notificacion, setNotificacion] = useState<{
    tipo: 'success' | 'error' | 'warning' | 'info';
    mensaje: string;
    visible: boolean;
  }>({
    tipo: 'info',
    mensaje: '',
    visible: false
  });

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

  const seleccionarPaqueteParaPago = (paquete: PaqueteMoneda) => {
    // Verificar autenticación
    const usuarioLogueado = sessionStorage.getItem('USUARIO');
    if (!usuarioLogueado) {
      mostrarNotificacion('warning', '🔒 Debes iniciar sesión para recargar monedas');
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

      mostrarNotificacion('success', `🎉 ¡Recarga exitosa!\n\n💳 ${metodoPago}\n🐰 +${paqueteSeleccionado.cantidad.toLocaleString()} monedas\n💰 $${paqueteSeleccionado.precio.toFixed(2)} USD\n\n✨ Nuevo saldo: ${nuevoSaldo.toLocaleString()} monedas`);
      
      // Cerrar modal y actualizar saldo sin recargar página
      cerrarModal();
      
      // Disparar evento para actualizar el encabezado
      window.dispatchEvent(new Event('monedas-actualizadas'));
    } catch (error) {
      mostrarNotificacion('error', '❌ Error al procesar el pago. Inténtalo nuevamente.');
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
      mostrarNotificacion('warning', '⚠️ Por favor ingresa un monto válido (mínimo $1 USD)');
      return;
    }
    
    if (monto > 1000) {
      mostrarNotificacion('warning', '⚠️ El monto máximo es de $1000 USD');
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
      mostrarNotificacion('warning', '⚠️ Por favor ingresa una cantidad válida (mínimo 95 monedas)');
      return;
    }
    
    if (monedas > 95000) {
      mostrarNotificacion('warning', '⚠️ El máximo es de 95,000 monedas');
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

  // Componente de notificación elegante
  const NotificacionElegante = () => {
    if (!notificacion.visible) return null;
    
    const colores = {
      success: { bg: 'rgba(34, 197, 94, 0.9)', border: '#22c55e', icon: '✅' },
      error: { bg: 'rgba(239, 68, 68, 0.9)', border: '#ef4444', icon: '❌' },
      warning: { bg: 'rgba(245, 158, 11, 0.9)', border: '#f59e0b', icon: '⚠️' },
      info: { bg: 'rgba(59, 130, 246, 0.9)', border: '#3b82f6', icon: 'ℹ️' }
    };
    
    const color = colores[notificacion.tipo];
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '400px',
        zIndex: 10000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        animation: 'slideIn 0.3s ease-out',
        color: 'white',
        fontWeight: '500'
      }}>
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px' 
        }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{color.icon}</span>
          <div style={{ 
            whiteSpace: 'pre-line', 
            lineHeight: '1.4' 
          }}>
            {notificacion.mensaje}
          </div>
          <button 
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  };

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
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    color: 'white',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 191, 255, 0.1)',
    border: '1px solid rgba(0, 191, 255, 0.2)'
  };

  return (
    <div style={modalStyle} onClick={(e) => {
      if (e.target === e.currentTarget) {
        cerrarModal();
      }
    }}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(0, 191, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ConejoMoneda size="32" animate={true} />
            <h2 style={{ 
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #00bfff 0%, #0080cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {mostrarPago ? 'Completa tu compra' : 'Recargar MONEDAS'}
            </h2>
          </div>
          <button 
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: 'none', 
              color: '#ccc', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onClick={mostrarPago ? volverASeleccion : cerrarModal}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
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
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#00bfff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <ConejoMoneda size="30" animate={true} />
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
                border: '1px solid rgba(0, 191, 255, 0.3)'
              }}>
                <div style={{ fontSize: '14px', color: '#00bfff', marginBottom: '5px' }}>
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
                  background: 'rgba(0, 191, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#00bfff',
                  border: '1px solid rgba(0, 191, 255, 0.3)'
                }}>
                  <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                    🔄 Procesando pago...
                  </div>
                  <div style={{ fontSize: '12px', color: '#87CEEB' }}>
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
            <div style={{ 
              marginBottom: '30px', 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(0, 191, 255, 0.05) 100%)', 
              borderRadius: '16px',
              border: '1px solid rgba(0, 191, 255, 0.2)',
              boxShadow: '0 4px 6px -1px rgba(0, 191, 255, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                <ConejoMoneda size="24" animate={true} />
                <span>Tu saldo:</span>
                <span style={{ 
                  color: '#00bfff',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>
                  {saldoActual.toLocaleString()}
                </span>
                <span style={{ 
                  fontSize: '14px',
                  color: '#94a3b8'
                }}>
                  monedas
                </span>
              </div>
            </div>

            {/* Selector de modo */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '25px',
                padding: '6px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px'
              }}>
                <button
                  onClick={() => setModoPersonalizado(false)}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    backgroundColor: !modoPersonalizado ? '#00bfff' : 'transparent',
                    color: !modoPersonalizado ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxShadow: !modoPersonalizado ? '0 4px 6px -1px rgba(0, 191, 255, 0.3)' : 'none'
                  }}
                >
                  📦 PAQUETES PREDEFINIDOS
                </button>
                <button
                  onClick={() => setModoPersonalizado(true)}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    backgroundColor: modoPersonalizado ? '#00bfff' : 'transparent',
                    color: modoPersonalizado ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxShadow: modoPersonalizado ? '0 4px 6px -1px rgba(0, 191, 255, 0.3)' : 'none'
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
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '25px'
              }}>
                {paquetes.map((paquete, index) => (
                  <button 
                    key={index} 
                    style={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      border: '2px solid #475569',
                      borderRadius: '16px',
                      padding: '20px 10px',
                      textAlign: 'center' as const,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: 'white',
                      fontSize: '14px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transform: 'translateY(0)',
                      position: 'relative' as const,
                      overflow: 'hidden'
                    }}
                    onClick={() => seleccionarPaqueteParaPago(paquete)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
                      e.currentTarget.style.borderColor = '#00bfff';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 191, 255, 0.1), 0 10px 10px -5px rgba(0, 191, 255, 0.04)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
                      e.currentTarget.style.borderColor = '#475569';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <div style={{ 
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '32px'
                    }}>
                      <ConejoMoneda size="28" animate={true} />
                    </div>
                    <div style={{ 
                      fontWeight: '700', 
                      marginBottom: '6px',
                      fontSize: '14px',
                      letterSpacing: '0.3px'
                    }}>
                      {paquete.cantidad.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#94a3b8',
                      marginBottom: '8px',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '1px'
                    }}>
                      MONEDAS
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#00bfff',
                      textShadow: '0 0 10px rgba(0, 191, 255, 0.3)'
                    }}>
                      ${paquete.precio.toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#64748b',
                      marginTop: '2px'
                    }}>
                      USD
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
                  <h4 style={{ marginBottom: '15px', color: '#00bfff' }}>💸 Ingresa el monto en USD</h4>
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
                      <span style={{ color: '#00bfff' }}>
                        💰 Recibirás: <strong>{calcularMonedas(parseFloat(montoPersonalizado) || 0).toLocaleString()} monedas</strong>
                      </span>
                    </div>
                  )}
                  <button
                    onClick={manejarRecargaConMonto}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#00bfff',
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
                  <h4 style={{ marginBottom: '15px', color: '#FF9800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ConejoMoneda size="20" /> O especifica cantidad de monedas
                  </h4>
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <ConejoMoneda size="18" /> Comprar {monedasPersonalizadas || '0'} monedas
                    </span>
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
      <NotificacionElegante />
    </div>
  );
};

export default ModalRecargaMonedas;