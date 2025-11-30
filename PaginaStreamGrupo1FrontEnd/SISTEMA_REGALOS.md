# 🎁 Sistema de Regalos Personalizado

## Descripción
Sistema completo de gestión de regalos para streamers, similar a Kick. Permite a los streamers crear, editar y eliminar regalos personalizados con imágenes personalizadas, además de usar los regalos predeterminados de la plataforma.

## Características

### Para Streamers (Gestión en Dashboard)
- ✅ **Crear regalos personalizados** con nombre, imagen URL, precio y puntos
- ✅ **Editar regalos existentes** (solo los personalizados)
- ✅ **Eliminar regalos personalizados**
- ✅ **Vista previa de imagen** al crear/editar
- ✅ **Límite de 20 regalos personalizados** por streamer
- ✅ **Gestión integrada en el Dashboard del creador**
- ✅ **Validaciones** de formulario

### Para Espectadores (En el Stream)
- ✅ **Ver regalos predeterminados** de la plataforma (con emojis)
- ✅ **Ver regalos exclusivos** del streamer actual (con imágenes personalizadas)
- ✅ **Secciones separadas** visualmente entre predeterminados y personalizados
- ✅ **Badge "Exclusivo"** en regalos personalizados
- ✅ **Sistema de puntos** que otorga cada regalo
- ✅ **Panel de regalos en el chat** del Dashboard para enviar regalos

## Estructura de Archivos

```
src/
├── types/
│   └── regalos.ts              # Tipos e interface Regalo + regalos predeterminados
├── utils/
│   └── regalos.ts              # Funciones CRUD para regalos personalizados
├── paginas/
│   ├── PanelRegalosStreamer.tsx   # Panel de gestión para streamers
│   └── CatalogoRegalosCliente.tsx # Catálogo de regalos para clientes
└── Styles/
    ├── PanelRegalosStreamer.css   # Estilos del panel de gestión
    └── CatalogoRegalos.css        # Estilos del catálogo (actualizado)
```

## Interface Regalo

```typescript
export interface Regalo {
  id: string;                    // ID único
  nombre: string;                // Nombre del regalo
  precio: number;                // Costo en monedas
  emoji?: string;                // Emoji (solo para predeterminados)
  imagenUrl?: string;            // URL de imagen (para personalizados)
  puntos: number;                // Puntos que otorga al streamer
  esPredeterminado: boolean;     // true = predeterminado, false = personalizado
  streamerId?: string;           // ID del streamer (solo para personalizados)
}
```

## Regalos Predeterminados

| Emoji | Nombre | Precio | Puntos |
|-------|--------|--------|--------|
| ⭐ | Estrella | 5 🪙 | 5 |
| 💖 | Corazón | 10 🪙 | 10 |
| 🎉 | Confeti | 25 🪙 | 25 |
| 🔥 | Fuego | 50 🪙 | 50 |
| 💎 | Diamante | 100 🪙 | 100 |
| 👑 | Corona | 200 🪙 | 200 |
| 🚀 | Cohete | 500 🪙 | 500 |
| 🎯 | Diana | 1000 🪙 | 1000 |

## Funciones Principales

### `crearRegalo(nombre, precio, imagenUrl, puntos, streamerId)`
Crea un nuevo regalo personalizado para el streamer.

**Validaciones:**
- Nombre no vacío (máx 30 caracteres)
- Precio > 0
- Puntos >= 0
- URL de imagen no vacía
- No exceder límite de 20 regalos
- Tamaño recomendado: 128x128px (formatos: PNG, JPG, GIF)

### `editarRegalo(id, nombre, precio, imagenUrl, puntos)`
Edita un regalo personalizado existente (no se pueden editar predeterminados).

### `eliminarRegalo(id)`
Elimina un regalo personalizado (no se pueden eliminar predeterminados).

### `obtenerTodosLosRegalos(streamerId?)`
Obtiene todos los regalos disponibles (predeterminados + personalizados del streamer).

## Almacenamiento

Los regalos personalizados se guardan en `localStorage` con la clave:
```
REGALOS_PERSONALIZADOS
```

Estructura:
```json
[
  {
    "id": "custom_1234567890_abc123",
    "nombre": "Super Regalo",
    "precio": 150,
    "emoji": "🎁",
    "puntos": 150,
    "esPredeterminado": false,
    "streamerId": "usuario123"
  }
]
```

## Uso

### Como Streamer (En el Dashboard)

1. **Accede al Dashboard del Creador** (`/dashboard`)
2. **Abre el panel de regalos** (botón 🎁 en el chat)
3. Los regalos se muestran en dos secciones:
   - 🎁 **Predeterminados**: Regalos base de la plataforma
   - ✨ **Exclusivos del Streamer**: Tus regalos personalizados

**Para gestionar regalos:**
1. Ve a **Panel de Regalos del Streamer** (`/streamer/panel`) o accede desde el Dashboard
2. Completa el formulario:
   - **Nombre**: Nombre descriptivo del regalo
   - **URL de Imagen**: Enlace a la imagen del regalo (tamaño recomendado: 128x128px)
   - **Vista previa**: Se muestra automáticamente al ingresar la URL
   - **Precio**: Costo en monedas que pagan los espectadores
   - **Puntos**: Puntos que otorga al streamer cuando lo recibe
3. Click en "Crear Regalo"
4. Para editar: Click en ✏️
5. Para eliminar: Click en 🗑️

### Como Espectador (Viendo el Stream)

1. Abre el **Dashboard del streamer** que estás viendo
2. Click en el botón de **regalo 🎁** en el chat
3. Verás dos secciones:
   - **🎁 Predeterminados**: Regalos estándar con emojis
   - **✨ Exclusivos del Streamer**: Regalos personalizados con imágenes únicas
4. Click en el regalo que deseas enviar (si tienes suficientes monedas)

## Diseño Visual

### Diferenciación Visual
- **Regalos Predeterminados**: 
  - Emojis grandes (⭐💖🎉🔥💎👑🚀🎯)
  - Borde gris (`#4a5568`)
  - Badge "Predeterminado"
  
- **Regalos Personalizados**: 
  - Imágenes personalizadas (64x64px o 80x80px según contexto)
  - Borde azul cian (`#00d9ff`) o morado (`#764ba2`)
  - Badge "Exclusivo" con gradiente morado
  - Fondo con gradiente sutil

### Ubicaciones
1. **Dashboard del Creador** → Panel de chat → Botón 🎁 → Muestra ambas secciones
2. **Panel de Gestión** (`/streamer/panel`) → Formulario + listado completo
3. **Catálogo Público** (`/regalos`) → Vista para todos los usuarios

### Efectos
- Hover: elevación de tarjeta con sombra
- Botones con animación de escala
- Gradientes en botones primarios
- Vista previa en tiempo real de imágenes

## Responsive

- **Desktop**: Grid adaptativo con min-width 140px
- **Tablet**: Grid con min-width 120px
- **Mobile**: 2 columnas fijas

## Mejoras Futuras

- [ ] Animaciones al enviar regalo (overlay en stream)
- [ ] Sistema de categorías para regalos
- [ ] Regalos temporales (eventos especiales)
- [ ] Estadísticas de regalos más enviados
- [ ] Previsualización del regalo antes de crear
- [ ] Importar/exportar configuración de regalos
- [ ] Regalos con efectos especiales en pantalla

## Integración con GiftOverlay

Los regalos están listos para integrarse con el componente `RegaloOverlay/GiftOverlay.tsx` para mostrar animaciones en el stream cuando se envía un regalo.

## Notas Técnicas

- Usa TypeScript con tipos estrictos
- Implementa validaciones tanto en cliente como en funciones utilitarias
- localStorage para persistencia
- Eventos personalizados para sincronización de UI
- CSS modular y responsive
