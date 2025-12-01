import type { Regalo } from "../types/regalos";
import { REGALOS_PREDETERMINADOS } from "../types/regalos";
import { API_ENDPOINTS } from "../config/api";

const STORAGE_KEY = "REGALOS_PERSONALIZADOS";

/**
 * Obtiene el token de autenticación
 */
function getAuthToken(): string | null {
  // Buscar primero en localStorage (donde se guarda al hacer login)
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Sincroniza regalos con el backend
 */
async function sincronizarRegalosConBackend(streamerId?: string): Promise<Regalo[]> {
  try {
    const token = getAuthToken();
    console.log('🔄 [sincronizarRegalosConBackend] Token:', !!token, 'StreamerId:', streamerId);
    
    if (!token || !streamerId) {
      console.log('⚠️ [sincronizarRegalosConBackend] Sin token o streamerId, usando localStorage');
      return obtenerRegalosPersonalizadosSync();
    }

    const url = API_ENDPOINTS.gifts.streamer(streamerId);
    console.log('📡 [sincronizarRegalosConBackend] Llamando a:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📥 [sincronizarRegalosConBackend] Respuesta:', response.status, response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [sincronizarRegalosConBackend] Regalos recibidos:', data.gifts?.length);
      // Guardar en localStorage como cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.gifts || []));
      return data.gifts || [];
    }
    
    console.log('⚠️ [sincronizarRegalosConBackend] Respuesta no OK, usando localStorage');
    return obtenerRegalosPersonalizadosSync();
  } catch (error) {
    console.error('❌ [sincronizarRegalosConBackend] Error:', error);
    return obtenerRegalosPersonalizadosSync();
  }
}

/**
 * Obtiene todos los regalos personalizados del localStorage (versión sincrónica)
 */
function obtenerRegalosPersonalizadosSync(): Regalo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al obtener regalos personalizados:", error);
    return [];
  }
}

/**
 * Obtiene todos los regalos personalizados del localStorage
 */
export const obtenerRegalosPersonalizados = (): Regalo[] => {
  return obtenerRegalosPersonalizadosSync();
};

/**
 * Obtiene los regalos personalizados de un streamer específico
 */
export const obtenerRegalosDeStreamer = async (streamerId: string): Promise<Regalo[]> => {
  console.log('🎁 [obtenerRegalosDeStreamer] Obteniendo regalos para:', streamerId);
  const regalos = await sincronizarRegalosConBackend(streamerId);
  console.log('📊 [obtenerRegalosDeStreamer] Regalos encontrados:', regalos.length);
  // Filtrar por streamerId en caso de que haya regalos de otros streamers
  const regalosFiltrados = regalos.filter(r => !r.streamerId || r.streamerId === streamerId);
  console.log('✅ [obtenerRegalosDeStreamer] Después de filtrar:', regalosFiltrados.length);
  return regalosFiltrados;
};

/**
 * Obtiene todos los regalos (predeterminados + personalizados) de un streamer
 */
export const obtenerTodosLosRegalos = async (
  streamerId?: string
): Promise<{ predeterminados: Regalo[]; personalizados: Regalo[] }> => {
  const personalizados = streamerId ? await obtenerRegalosDeStreamer(streamerId) : [];
  return {
    predeterminados: REGALOS_PREDETERMINADOS,
    personalizados,
  };
};

/**
 * Crea un nuevo regalo personalizado y lo sincroniza con el backend
 */
export const crearRegalo = async (
  nombre: string,
  precio: number,
  imagenUrl: string,
  puntos: number,
  streamerId: string,
  audioUrl?: string
): Promise<Regalo | null> => {
  try {
    // Validaciones básicas
    if (!nombre || nombre.trim().length === 0) {
      throw new Error("El nombre del regalo es obligatorio");
    }
    if (precio <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (puntos < 0) {
      throw new Error("Los puntos no pueden ser negativos");
    }

    const tieneImagen = !!imagenUrl && imagenUrl.trim().length > 0;
    const tieneAudio = !!audioUrl && audioUrl.trim().length > 0;

    if (!tieneImagen && !tieneAudio) {
      throw new Error("Debes ingresar una imagen o un audio para el regalo");
    }

    const token = getAuthToken();
    console.log('🔑 [crearRegalo] Token encontrado:', !!token);
    
    if (token) {
      // Intentar crear en el backend
      console.log('🌐 [crearRegalo] Enviando al backend:', { nombre, precio, puntos, streamerId });
      const response = await fetch(API_ENDPOINTS.gifts.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          precio,
          imagenUrl: tieneImagen ? imagenUrl.trim() : null,
          audioUrl: tieneAudio ? audioUrl.trim() : null,
          puntos,
          color: '#ffffff' // Color por defecto
        })
      });

      console.log('📡 [crearRegalo] Respuesta del backend:', response.status, response.ok);
      if (response.ok) {
        const data = await response.json();
        const nuevoRegalo = data.gift;
        console.log('✅ [crearRegalo] Regalo recibido del backend:', nuevoRegalo);
        
        // Actualizar cache local
        const regalos = obtenerRegalosPersonalizadosSync();
        console.log('📦 [crearRegalo] Regalos antes de agregar:', regalos.length);
        regalos.push(nuevoRegalo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(regalos));
        console.log('💾 [crearRegalo] Regalo guardado en localStorage. Total:', regalos.length);
        
        return nuevoRegalo;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [crearRegalo] Error del backend:', response.status, errorData);
      }
    }

    // Fallback: crear solo en localStorage
    console.log('💾 [crearRegalo] Creando en localStorage (sin backend/token)');
    const regalos = obtenerRegalosPersonalizadosSync();
    console.log('📦 [crearRegalo] Regalos existentes:', regalos.length);
    const nuevoRegalo: Regalo = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: nombre.trim(),
      precio,
      imagenUrl: tieneImagen ? imagenUrl.trim() : undefined,
      audioUrl: tieneAudio ? audioUrl.trim() : undefined,
      puntos,
      esPredeterminado: false,
      streamerId,
    };

    regalos.push(nuevoRegalo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regalos));
    console.log('✅ [crearRegalo] Regalo guardado en localStorage:', nuevoRegalo);
    console.log('📊 [crearRegalo] Total de regalos:', regalos.length);

    return nuevoRegalo;
  } catch (error) {
    console.error("Error al crear regalo:", error);
    return null;
  }
};

/**
 * Edita un regalo personalizado existente
 */
export const editarRegalo = (
  id: string,
  nombre: string,
  precio: number,
  imagenUrl: string,
  puntos: number,
  audioUrl?: string
): boolean => {
  try {
    const regalos = obtenerRegalosPersonalizadosSync();
    const index = regalos.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error("Regalo no encontrado");
    }

    // No se puede editar un regalo predeterminado
    if (regalos[index].esPredeterminado) {
      throw new Error("No se pueden editar regalos predeterminados");
    }

    // Validaciones básicas
    if (!nombre || nombre.trim().length === 0) {
      throw new Error("El nombre del regalo es obligatorio");
    }
    if (precio <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (puntos < 0) {
      throw new Error("Los puntos no pueden ser negativos");
    }

    const tieneImagen = !!imagenUrl && imagenUrl.trim().length > 0;
    const tieneAudio = !!audioUrl && audioUrl.trim().length > 0;

    if (!tieneImagen && !tieneAudio) {
      throw new Error("Debes ingresar una imagen o un audio para el regalo");
    }

    regalos[index] = {
      ...regalos[index],
      nombre: nombre.trim(),
      precio,
      imagenUrl: tieneImagen ? imagenUrl.trim() : undefined,
      audioUrl: tieneAudio ? audioUrl.trim() : undefined,
      puntos,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(regalos));
    return true;
  } catch (error) {
    console.error("Error al editar regalo:", error);
    return false;
  }
};

/**
 * Elimina un regalo personalizado
 */
export const eliminarRegalo = (id: string): boolean => {
  try {
    const regalos = obtenerRegalosPersonalizadosSync();
    const regalo = regalos.find((r) => r.id === id);

    if (!regalo) {
      throw new Error("Regalo no encontrado");
    }

    // No se puede eliminar un regalo predeterminado
    if (regalo.esPredeterminado) {
      throw new Error("No se pueden eliminar regalos predeterminados");
    }

    const nuevosRegalos = regalos.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosRegalos));

    return true;
  } catch (error) {
    console.error("Error al eliminar regalo:", error);
    return false;
  }
};

/**
 * Verifica si un streamer puede crear más regalos (límite opcional)
 */
export const puedeCrearMasRegalos = (
  streamerId: string,
  limite: number = 20
): boolean => {
  const regalos = obtenerRegalosPersonalizadosSync().filter(
    r => r.streamerId === streamerId
  );
  return regalos.length < limite;
};

