# Carpeta de Imágenes

Esta carpeta contiene las imágenes utilizadas en el reproductor de streams y otros componentes visuales.

## Archivos:

### Stream Thumbnails:
- `lacobraaa-stream.jpg` - Imagen principal para el reproductor del stream de LACOBRAAA

## Especificaciones:
- **Formato:** JPG, PNG
- **Tamaño recomendado:** 1920x1080px (16:9) para streams
- **Peso máximo:** 500KB por imagen para optimizar carga

## Cómo agregar nuevas imágenes:
1. Guarda la imagen en esta carpeta `public/imagenes/`
2. Usa el nombre descriptivo: `[streamer]-stream.jpg`
3. Referencia en el código: `/imagenes/nombre-archivo.jpg`

## Ejemplo de uso en código:
```tsx
style={{
  backgroundImage: 'url(/imagenes/lacobraaa-stream.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}
```
