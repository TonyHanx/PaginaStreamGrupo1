import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Importa los estilos CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa los scripts JavaScript de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from "./App";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
