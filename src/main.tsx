// Importamos React y el DOM para montar la aplicación.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Importamos la hoja de estilos (Tailwind CSS).
import "./index.css";
// Importamos el componente raíz de la aplicación.
import App from "./App";

// Obtenemos el elemento del DOM donde se montará la app (el div#root de index.html).
const container = document.getElementById("root");

// Aseguramos que el contenedor exista (no debe ser null en un proyecto Vite normal).
if (container) {
  // createRoot inicia React 19 con el sistema raíz moderno.
  const root = createRoot(container);
  // Renderizamos la app dentro de StrictMode (modo estricto de React, detecta
  // problemas potenciales en desarrollo).
  root.render(
    // StrictMode ayuda a resaltar efectos no seguros en desarrollo.
    <StrictMode>
      {/* Componente raíz con todas las rutas y el contexto de auth */}
      <App />
    </StrictMode>
  );
}
