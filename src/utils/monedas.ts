// Sistema de monedas de la tienda (las que se compran con dinero real)

export interface UserMonedas {
  username: string;
  monedas: number;
}

/**
 * Obtiene las monedas del usuario actual desde sessionStorage
 */
export function obtenerMonedasUsuario(): UserMonedas | null {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    return {
      username: usuario.username || '',
      monedas: usuario.monedas ?? 0 // Cambiar a 0 por defecto en lugar de 1000
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
    
    // Disparar evento de storage para notificar cambios
    window.dispatchEvent(new Event('storage'));
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
 * Agrega monedas al usuario actual (para cuando compre en la tienda)
 */
export function agregarMonedas(cantidad: number): boolean {
  const datosUsuario = obtenerMonedasUsuario();
  if (!datosUsuario) return false;
  
  const nuevasMonedas = datosUsuario.monedas + cantidad;
  guardarMonedasUsuario({ ...datosUsuario, monedas: nuevasMonedas });
  return true;
}

/**
 * Inicializa monedas de demostración solo para usuarios nuevos (una sola vez)
 */
export function inicializarMonedasDemo(): void {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return;
    
    const usuario = JSON.parse(usuarioStr);
    
    // Solo dar monedas de demo si es la primera vez que inicia sesión
    // y no tiene monedas definidas
    if (usuario.monedas === undefined || usuario.monedas === null) {
      usuario.monedas = 1000; // 1000 monedas iniciales al registrarse
      sessionStorage.setItem('USUARIO', JSON.stringify(usuario));
      console.log("🎉 ¡1000 monedas iniciales otorgadas al usuario!", usuario.username);
      window.dispatchEvent(new Event('storage'));
    }
  } catch {
    // Si hay error, no hacer nada
  }
}