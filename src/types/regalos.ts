export interface Regalo {
  id: string;
  nombre: string;
  precio: number;
  emoji?: string; // Emoji para regalos predeterminados
  imagenUrl?: string; // URL de imagen para regalos personalizados
  audioUrl?: string; // URL de audio para regalos sonoros (opcional)
  puntos: number; // Puntos que otorga al streamer
  esPredeterminado: boolean;
  streamerId?: string; // ID del streamer que creó el regalo (si es personalizado)
  color?: string; // Color asociado al regalo (opcional)
  

}

export const REGALOS_PREDETERMINADOS: Regalo[] = [
  { id: "star", nombre: "Estrella", precio: 5, emoji: "⭐", puntos: 5, esPredeterminado: true },
  { id: "heart", nombre: "Corazón", precio: 10, emoji: "💖", puntos: 10, esPredeterminado: true },
  { id: "confetti", nombre: "Confeti", precio: 25, emoji: "🎉", puntos: 25, esPredeterminado: true },
  { id: "fire", nombre: "Fuego", precio: 50, emoji: "🔥", puntos: 50, esPredeterminado: true },
  { id: "diamond", nombre: "Diamante", precio: 100, emoji: "💎", puntos: 100, esPredeterminado: true },
  { id: "crown", nombre: "Corona", precio: 200, emoji: "👑", puntos: 200, esPredeterminado: true },
  { id: "rocket", nombre: "Cohete", precio: 500, emoji: "🚀", puntos: 500, esPredeterminado: true },
  { id: "target", nombre: "Diana", precio: 1000, emoji: "🎯", puntos: 1000, esPredeterminado: true },
];
