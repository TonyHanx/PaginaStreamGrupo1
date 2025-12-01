// Sistema de monedas de la tienda (las que se compran con dinero real)
import { API_ENDPOINTS } from '../config/api';
import { addTransactionToLocalStorage } from '../services/transactionService';

export interface UserMonedas {
  username: string;
  monedas: number;
}

/**
 * Obtiene el token de autenticación
 */
function getAuthToken(): string | null {
  // Buscar primero en localStorage (donde se guarda al hacer login)
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Sincroniza las monedas con el backend
 */
async function sincronizarBalanceConBackend(): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(API_ENDPOINTS.gifts.balance, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Actualizar el sessionStorage con los datos del backend
      const usuarioStr = sessionStorage.getItem('USUARIO');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        usuario.monedas = data.monedas;
        usuario.puntos = data.puntos;
        sessionStorage.setItem('USUARIO', JSON.stringify(usuario));
      }
    }
  } catch (error) {
    console.error('Error al sincronizar balance:', error);
  }
}

/**
 * Obtiene las monedas del usuario actual desde sessionStorage (versión sincrónica)
 */
export function obtenerMonedasUsuario(): UserMonedas | null {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    return {
      username: usuario.username || '',
      monedas: usuario.monedas ?? 0
    };
  } catch {
    return null;
  }
}

/**
 * Obtiene las monedas del usuario actual desde sessionStorage
 * y sincroniza con el backend si es posible (versión asíncrona)
 */
export async function obtenerMonedasUsuarioAsync(): Promise<UserMonedas | null> {
  try {
    // Intentar sincronizar primero con el backend
    await sincronizarBalanceConBackend();
    
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    return {
      username: usuario.username || '',
      monedas: usuario.monedas ?? 0 // Si no existe, iniciar en 0
    };
  } catch {
    return null;
  }
}

/**
 * Guarda las monedas del usuario en sessionStorage
 */
export function guardarMonedasUsuario(userData: UserMonedas): void {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return;
    
    const usuario = JSON.parse(usuarioStr);
    usuario.monedas = userData.monedas;
    
    sessionStorage.setItem('USUARIO', JSON.stringify(usuario));
    
    // Sincronizar con localStorage si está registrado
    const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
    if (registradoStr) {
      const registrado = JSON.parse(registradoStr);
      if (registrado.username === usuario.username) {
        registrado.monedas = userData.monedas;
        localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify(registrado));
      }
    }
    
    // Disparar múltiples eventos para asegurar sincronización
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('monedas-actualizadas'));
    window.dispatchEvent(new CustomEvent('saldo-actualizado', { 
      detail: { monedas: userData.monedas } 
    }));
  } catch {
    // Si hay error, no hacer nada
  }
}

/**
 * Resta monedas al usuario actual
 */
export function gastarMonedas(cantidad: number): boolean {
  const datosUsuario = obtenerMonedasUsuario();
  if (!datosUsuario || datosUsuario.monedas < cantidad) {
    return false;
  }
  
  const nuevasMonedas = datosUsuario.monedas - cantidad;
  guardarMonedasUsuario({ ...datosUsuario, monedas: nuevasMonedas });
  return true;
}

/**
 * Agrega monedas al usuario actual y sincroniza con el backend
 */
export async function agregarMonedas(cantidad: number): Promise<boolean> {
  try {
    console.log('💰 [agregarMonedas] Iniciando compra de', cantidad, 'monedas');
    const token = getAuthToken();
    
    if (!token) {
      console.log('⚠️ [agregarMonedas] Sin token, usando localStorage');
      // Si no hay token, usar solo localStorage
      const datosUsuario = obtenerMonedasUsuario();
      if (!datosUsuario) return false;
      
      const nuevasMonedas = datosUsuario.monedas + cantidad;
      guardarMonedasUsuario({ ...datosUsuario, monedas: nuevasMonedas });
      
      // Registrar transacción local
      console.log('📝 [agregarMonedas] Registrando transacción local');
      addTransactionToLocalStorage({
        userId: '',
        tipo: 'compra_monedas',
        monto: cantidad,
        descripcion: `Compra de ${cantidad} monedas`
      });
      
      return true;
    }

    console.log('🌐 [agregarMonedas] Enviando solicitud al backend');
    // Llamar al backend para registrar la compra
    const response = await fetch(API_ENDPOINTS.gifts.buyCoins, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cantidad })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ [agregarMonedas] Respuesta del backend:', data);
      // Actualizar localStorage con el balance del backend
      const datosUsuario = obtenerMonedasUsuario();
      if (datosUsuario) {
        guardarMonedasUsuario({ ...datosUsuario, monedas: data.monedas });
      }
      
      // La transacción ya se registró en el backend, 
      // se sincronizará automáticamente al consultar el historial
      
      return true;
    }
    
    console.error('❌ [agregarMonedas] Error en respuesta del backend:', response.status);
    return false;
  } catch (error) {
    console.error('❌ [agregarMonedas] Error:', error);
    // Fallback: usar solo localStorage
    const datosUsuario = obtenerMonedasUsuario();
    if (!datosUsuario) return false;
    
    const nuevasMonedas = datosUsuario.monedas + cantidad;
    guardarMonedasUsuario({ ...datosUsuario, monedas: nuevasMonedas });
    
    // Registrar transacción local
    console.log('📝 [agregarMonedas] Registrando transacción local (fallback)');
    addTransactionToLocalStorage({
      userId: '',
      tipo: 'compra_monedas',
      monto: cantidad,
      descripcion: `Compra de ${cantidad} monedas`
    });
    
    return true;
  }
}

/**
 * Versión sincrónica de obtenerMonedasUsuario (para compatibilidad con código existente)
 */
function obtenerMonedasUsuarioSync(): UserMonedas | null {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    return {
      username: usuario.username || '',
      monedas: usuario.monedas ?? 0
    };
  } catch {
    return null;
  }
}
