// Sistema de progreso para streamers basado en horas de transmisión

export interface StreamerData {
  username: string;
  horasTransmision: number;
  nivel: number;
  seguidores: number;
  totalDonaciones: number;
}

/**
 * Obtiene los datos del streamer desde sessionStorage
 */
export function obtenerDatosStreamer(): StreamerData | null {
  try {
    const usuarioStr = sessionStorage.getItem('USUARIO');
    if (!usuarioStr) return null;
    
    const usuario = JSON.parse(usuarioStr);
    
    // Datos específicos del streamer
    return {
      username: usuario.username || '',
      horasTransmision: usuario.horasTransmision || 0,
      nivel: usuario.nivelStreamer || 1,
      seguidores: usuario.seguidores || 0,
      totalDonaciones: usuario.totalDonaciones || 0
    };
  } catch {
    return null;
  }
}

/**
 * Guarda los datos del streamer en sessionStorage y localStorage
 */
export function guardarDatosStreamer(streamerData: StreamerData): void {
  try {
    // Obtener datos actuales para conservar otras propiedades
    const usuarioStr = sessionStorage.getItem('USUARIO');
    let usuarioActual = usuarioStr ? JSON.parse(usuarioStr) : {};
    
    // Actualizar datos del streamer
    const usuarioActualizado = {
      ...usuarioActual,
      username: streamerData.username,
      horasTransmision: streamerData.horasTransmision,
      nivelStreamer: streamerData.nivel,
      seguidores: streamerData.seguidores,
      totalDonaciones: streamerData.totalDonaciones
    };
    
    sessionStorage.setItem('USUARIO', JSON.stringify(usuarioActualizado));
    
    // También actualizar localStorage si el usuario está registrado
    const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
    if (registradoStr) {
      const registrado = JSON.parse(registradoStr);
      if (registrado.username === streamerData.username) {
        localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify({
          ...registrado,
          horasTransmision: streamerData.horasTransmision,
          nivelStreamer: streamerData.nivel,
          seguidores: streamerData.seguidores,
          totalDonaciones: streamerData.totalDonaciones
        }));
      }
    }
    
    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event('streamer-actualizado'));
  } catch (error) {
    console.error('Error al guardar datos del streamer:', error);
  }
}

/**
 * Calcula el nivel del streamer basado en horas de transmisión
 * Sistema: Nivel 1: 0-10h, Nivel 2: 10-25h, Nivel 3: 25-50h, etc.
 */
export function calcularNivelStreamer(horasTransmision: number): {
  nivel: number;
  horasEnNivel: number;
  horasParaSiguiente: number;
  porcentaje: number;
} {
  let nivel = 1;
  let horasAcumuladas = 0;
  let horasNecesarias = 10; // Primer nivel requiere 10 horas
  
  // Sistema progresivo: cada nivel requiere más horas
  // Nivel 1: 10h, Nivel 2: 15h, Nivel 3: 25h, Nivel 4: 40h, etc.
  while (horasTransmision >= horasAcumuladas + horasNecesarias) {
    horasAcumuladas += horasNecesarias;
    nivel++;
    // Incremento progresivo: +5h base + (nivel * 5)
    horasNecesarias = 10 + (nivel * 5);
  }
  
  const horasEnNivelActual = horasTransmision - horasAcumuladas;
  const porcentaje = (horasEnNivelActual / horasNecesarias) * 100;
  
  return {
    nivel,
    horasEnNivel: parseFloat(horasEnNivelActual.toFixed(2)),
    horasParaSiguiente: horasNecesarias,
    porcentaje: parseFloat(porcentaje.toFixed(2))
  };
}

/**
 * Actualiza las horas de transmisión del streamer
 */
export function actualizarHorasTransmision(segundosTransmitidos: number): boolean {
  const streamer = obtenerDatosStreamer();
  if (!streamer) return false;
  
  // Convertir segundos a horas (con decimales)
  const horasAdicionales = segundosTransmitidos / 3600;
  streamer.horasTransmision += horasAdicionales;
  
  // Recalcular nivel
  const { nivel } = calcularNivelStreamer(streamer.horasTransmision);
  const nivelAnterior = streamer.nivel;
  streamer.nivel = nivel;
  
  guardarDatosStreamer(streamer);
  
  // Retornar true si subió de nivel
  return nivel > nivelAnterior;
}

/**
 * Incrementa el contador de seguidores
 */
export function agregarSeguidor(): void {
  const streamer = obtenerDatosStreamer();
  if (!streamer) return;
  
  streamer.seguidores++;
  guardarDatosStreamer(streamer);
}

/**
 * Registra una donación recibida
 */
export function registrarDonacion(monto: number): void {
  const streamer = obtenerDatosStreamer();
  if (!streamer) return;
  
  streamer.totalDonaciones += monto;
  guardarDatosStreamer(streamer);
}

/**
 * Obtiene el rango del streamer basado en su nivel
 */
export function obtenerRangoStreamer(nivel: number): {
  nombre: string;
  icono: string;
  color: string;
} {
  if (nivel >= 20) return { nombre: 'Leyenda', icono: '👑', color: '#FFD700' };
  if (nivel >= 15) return { nombre: 'Maestro', icono: '💎', color: '#00FFFF' };
  if (nivel >= 10) return { nombre: 'Experto', icono: '⭐', color: '#9B59B6' };
  if (nivel >= 5) return { nombre: 'Avanzado', icono: '🔥', color: '#E74C3C' };
  return { nombre: 'Novato', icono: '🌱', color: '#2ECC71' };
}
