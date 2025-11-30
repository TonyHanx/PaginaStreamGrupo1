// Sistema de puntos para espectadores

export interface UserData {
  username: string;
  puntos: number;
}

/**
 * Obtiene los datos del usuario actual desde sessionStorage
 */
export function obtenerDatosUsuario(): UserData | null {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    return {
      username: usuario.username || '',
      puntos: usuario.puntos || 0
    };
  } catch {
    return null;
  }
}

/**
 * Guarda los datos del usuario en sessionStorage
 */
export function guardarDatosUsuario(userData: UserData): void {
  try {
    // Conservar monedas si existen
    const usuarioStr = sessionStorage.getItem('USUARIO');
    let monedas = 0;
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      monedas = usuario.monedas ?? 0;
    }
    const usuarioFinal = { ...userData, monedas };
    sessionStorage.setItem('USUARIO', JSON.stringify(usuarioFinal));

    // También actualizar localStorage si el usuario está registrado
    const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
    if (registradoStr) {
      const registrado = JSON.parse(registradoStr);
      if (registrado.username === userData.username) {
        localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify({
          ...registrado,
          puntos: userData.puntos,
          monedas
        }));
      }
    }
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
  }
}

/**
 * Agrega puntos al usuario actual
 */
export function agregarPuntos(cantidad: number): boolean {
  const usuario = obtenerDatosUsuario();
  if (!usuario) return false;
  
  usuario.puntos += cantidad;
  guardarDatosUsuario(usuario);
  return true;
}

/**
 * Acciones que otorgan puntos
 */
export const AccionesPuntos = {
  VER_STREAM_5MIN: 5,          // Ver un stream por 5 minutos
  ENVIAR_MENSAJE_CHAT: 2,      // Enviar un mensaje en el chat
  SEGUIR_STREAMER: 10,         // Seguir a un streamer
  DONAR: 50,                   // Hacer una donación
  COMPARTIR_STREAM: 15,        // Compartir un stream
  PRIMERA_VEZ_DIA: 20,         // Bonificación diaria por primera conexión
};

/**
 * Calcula el nivel basado en los puntos
 */
export function calcularNivel(puntos: number): { 
  nivel: number; 
  puntosNivel: number; 
  puntosParaSiguiente: number;
  porcentaje: number;
} {
  // Sistema de niveles: cada nivel requiere 100 * nivel puntos
  // Nivel 1: 0-100 pts, Nivel 2: 100-300 pts, Nivel 3: 300-600 pts, etc.
  let nivel = 1;
  let puntosAcumulados = 0;
  let puntosNecesarios = 100;
  
  while (puntos >= puntosAcumulados + puntosNecesarios) {
    puntosAcumulados += puntosNecesarios;
    nivel++;
    puntosNecesarios = 100 * nivel;
  }
  
  const puntosEnNivelActual = puntos - puntosAcumulados;
  const porcentaje = (puntosEnNivelActual / puntosNecesarios) * 100;
  
  return {
    nivel,
    puntosNivel: puntosEnNivelActual,
    puntosParaSiguiente: puntosNecesarios,
    porcentaje
  };
}
