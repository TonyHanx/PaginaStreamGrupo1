// Utilidad para manejar rutas de assets en GitHub Pages
export const getAssetPath = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  // Si la ruta ya incluye la base, retornarla tal cual
  if (path.startsWith(base)) {
    return path;
  }
  // Si la ruta empieza con /, remover el / inicial
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

// Función específica para imágenes públicas
export const getPublicImagePath = (path: string): string => {
  return getAssetPath(path);
};
