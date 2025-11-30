# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

## 🧪 Pruebas: Overlay animado de regalos (Streamer)

Para verificar localmente el nuevo overlay animado que aparece cuando un streamer recibe un regalo sigue estos pasos:

1. Ejecuta la app en modo desarrollo:

```powershell
npm install
npm run dev
```

2. Abre la página del stream (ej. ruta `/stream/1`) — para simular que la sesión es del streamer asegúrate de tener en sessionStorage el usuario que coincide con el `streamerId` (ej. `userId: "1"`).

3. Si estás en la página del canal propio (como streamer) verás un botón "Simular regalo" en las acciones. Haz click para generar un evento de regalo y observar el overlay animado en pantalla.

4. Para probar la experiencia de un espectador: abre la misma página del stream en otra ventana (o en otra pestaña sin sesión de streamer) y envía un regalo desde la tienda de regalos — cuando el evento se dispare el streamer verá el overlay si está en su canal.

> Importante: el overlay animado ahora aparece en el Panel de Control del Creador (Dashboard). Eso significa que cuando un espectador envíe un regalo desde la página de viewer o desde la tienda, el streamer que tenga abierto su Panel de Control verá el overlay animado en su vista (no se muestra a espectadores).

Notas:
- El overlay se auto-cierra tras unos segundos, y también puedes cerrarlo manualmente.
- En una app real, el evento vendría desde el backend / websocket; aquí usamos un CustomEvent para simularlo durante desarrollo.


If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
