// Sistema de pagos y recarga de monedas

import { obtenerMonedasUsuario, guardarMonedasUsuario } from './monedas';

export interface PaqueteMoneda {
  cantidad: number;
  precio: number;
}

export interface TransaccionPago {
  id: string;
  fechaHora: Date;
  paquete: PaqueteMoneda;
  metodoPago: string;
  estado: 'exitoso' | 'fallido' | 'pendiente';
  montoTotal: number;
}

/**
 * Simula el procesamiento de un pago y recarga las monedas
 */
export async function procesarPago(
  paquete: PaqueteMoneda, 
  metodoPago: string
): Promise<TransaccionPago> {
  
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular éxito del pago (95% de probabilidad de éxito)
  const pagoExitoso = Math.random() > 0.05;
  
  const transaccion: TransaccionPago = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fechaHora: new Date(),
    paquete,
    metodoPago,
    estado: pagoExitoso ? 'exitoso' : 'fallido',
    montoTotal: paquete.precio
  };
  
  if (pagoExitoso) {
    // Actualizar monedas del usuario
    await recargarMonedas(paquete.cantidad);
    
    // Guardar transacción en el historial
    guardarTransaccion(transaccion);
  }
  
  return transaccion;
}

/**
 * Recarga monedas al usuario actual
 */
export async function recargarMonedas(cantidad: number): Promise<boolean> {
  console.log("Recargando monedas:", cantidad);
  try {
    const datosUsuario = obtenerMonedasUsuario();
    if (!datosUsuario) {
      throw new Error('Usuario no encontrado');
    }
    
    console.log("Datos usuario antes:", datosUsuario);
    
    // Actualizar monedas
    const nuevasMonedas = datosUsuario.monedas + cantidad;
    console.log("Nuevas monedas:", nuevasMonedas);
    
    // Actualizar en sessionStorage
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const usuarioActualizado = {
        ...usuario,
        monedas: nuevasMonedas
      };
      
      sessionStorage.setItem('USUARIO', JSON.stringify(usuarioActualizado));
      
      // Guardar también con la función de monedas
      guardarMonedasUsuario({
        username: datosUsuario.username,
        monedas: nuevasMonedas
      });
      
      // Disparar evento para actualizar la UI
      window.dispatchEvent(new Event('monedas-actualizadas'));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al recargar monedas:', error);
    return false;
  }
}

/**
 * Guarda una transacción en el historial local
 */
export function guardarTransaccion(transaccion: TransaccionPago): void {
  try {
    const historialStr = localStorage.getItem('historial-transacciones');
    const historial: TransaccionPago[] = historialStr ? JSON.parse(historialStr) : [];
    
    historial.push(transaccion);
    
    // Mantener solo las últimas 50 transacciones
    if (historial.length > 50) {
      historial.splice(0, historial.length - 50);
    }
    
    localStorage.setItem('historial-transacciones', JSON.stringify(historial));
  } catch (error) {
    console.error('Error al guardar transacción:', error);
  }
}

/**
 * Obtiene el historial de transacciones del usuario
 */
export function obtenerHistorialTransacciones(): TransaccionPago[] {
  try {
    const historialStr = localStorage.getItem('historial-transacciones');
    return historialStr ? JSON.parse(historialStr) : [];
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
}

/**
 * Valida si un método de pago es válido
 */
export function validarMetodoPago(metodoPago: string): boolean {
  const metodosValidos = ['tarjeta', 'google-pay', 'amazon-pay', 'cash-app'];
  return metodosValidos.includes(metodoPago);
}

/**
 * Obtiene información del método de pago
 */
export function obtenerInfoMetodoPago(metodoPago: string): { nombre: string; icono: string } {
  const metodos = {
    'tarjeta': { nombre: 'Tarjeta de Crédito/Débito', icono: '💳' },
    'google-pay': { nombre: 'Google Pay', icono: 'G' },
    'amazon-pay': { nombre: 'Amazon Pay', icono: 'PAY' },
    'cash-app': { nombre: 'Cash App Pay', icono: '$' }
  };
  
  return metodos[metodoPago as keyof typeof metodos] || { nombre: 'Desconocido', icono: '❓' };
}

/**
 * Genera una notificación de éxito para mostrar al usuario
 */
export function generarNotificacionRecarga(transaccion: TransaccionPago): string {
  if (transaccion.estado === 'exitoso') {
    return `¡Recarga exitosa! Se han añadido ${transaccion.paquete.cantidad.toLocaleString()} monedas a tu cuenta.`;
  } else {
    return `Error en el pago. Por favor, intenta nuevamente o usa otro método de pago.`;
  }
}