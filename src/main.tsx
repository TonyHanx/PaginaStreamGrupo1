import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; 

// Bootstrap (CSS + JS)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// App con las rutas
import App from "./App";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App/>  
    </AuthProvider>
  </StrictMode>
)