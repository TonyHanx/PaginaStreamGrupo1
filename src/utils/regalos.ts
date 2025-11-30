import type { Regalo } from "../types/regalos";
import { REGALOS_PREDETERMINADOS } from "../types/regalos";

const STORAGE_KEY = "REGALOS_PERSONALIZADOS";

/**
 * Obtiene todos los regalos personalizados del localStorage
 */
export const obtenerRegalosPersonalizados = (): Regalo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al obtener regalos personalizados:", error);
    return [];
  }
};

/**
 * Obtiene los regalos personalizados de un streamer específico
 */
export const obtenerRegalosDeStreamer = (streamerId: string): Regalo[] => {
  const regalos = obtenerRegalosPersonalizados();
  return regalos.filter((regalo) => regalo.streamerId === streamerId);
};

/**
 * Obtiene todos los regalos (predeterminados + personalizados) de un streamer
 */
export const obtenerTodosLosRegalos = (streamerId?: string): { predeterminados: Regalo[], personalizados: Regalo[] } => {
  const personalizados = streamerId ? obtenerRegalosDeStreamer(streamerId) : [];
  return {
    predeterminados: REGALOS_PREDETERMINADOS,
    personalizados,
  };
};

/**
 * Crea un nuevo regalo personalizado
 */
export const crearRegalo = (
  nombre: string,
  precio: number,
  imagenUrl: string,
  puntos: number,
  streamerId: string
): Regalo | null => {
  try {
    const regalos = obtenerRegalosPersonalizados();
    
    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
      throw new Error("El nombre del regalo es obligatorio");
    }
    if (precio <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (puntos < 0) {
      throw new Error("Los puntos no pueden ser negativos");
    }
    if (!imagenUrl || imagenUrl.trim().length === 0) {
      throw new Error("La URL de la imagen es obligatoria");
    }

    const nuevoRegalo: Regalo = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: nombre.trim(),
      precio,
      imagenUrl: imagenUrl.trim(),
      puntos,
      esPredeterminado: false,
      streamerId,
    };

    regalos.push(nuevoRegalo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regalos));
    
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
  puntos: number
): boolean => {
  try {
    const regalos = obtenerRegalosPersonalizados();
    const index = regalos.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error("Regalo no encontrado");
    }

    // No se puede editar un regalo predeterminado
    if (regalos[index].esPredeterminado) {
      throw new Error("No se pueden editar regalos predeterminados");
    }

    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
      throw new Error("El nombre del regalo es obligatorio");
    }
    if (precio <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (puntos < 0) {
      throw new Error("Los puntos no pueden ser negativos");
    }
    if (!imagenUrl || imagenUrl.trim().length === 0) {
      throw new Error("La URL de la imagen es obligatoria");
    }

    regalos[index] = {
      ...regalos[index],
      nombre: nombre.trim(),
      precio,
      imagenUrl: imagenUrl.trim(),
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
    const regalos = obtenerRegalosPersonalizados();
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
export const puedeCrearMasRegalos = (streamerId: string, limite: number = 20): boolean => {
  const regalos = obtenerRegalosDeStreamer(streamerId);
  return regalos.length < limite;
};
