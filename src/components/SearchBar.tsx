// Importamos useState y FormEvent para un formulario controlado de búsqueda.
import { useState, type FormEvent } from "react";

// Interface con las props:
// - onSearch: función que recibe el término de búsqueda al enviar el formulario.
interface SearchBarProps {
  // onSearch: se llama al pulsar buscar con el texto ingresado.
  onSearch: (term: string) => void;
}

// Componente de barra de búsqueda: formulario controlado que dispara la búsqueda al enviar.
export default function SearchBar({ onSearch }: SearchBarProps) {
  // Estado local para el texto escrito en el input (formulario controlado).
  const [term, setTerm] = useState("");

  // Función que maneja el envío del formulario (prevenimos el recargado de página).
  const handleSubmit = (e: FormEvent) => {
    // Evitamos el comportamiento por defecto (recargar la página y enviar GET).
    e.preventDefault();
    // Llamamos al callback con el término de búsqueda actual.
    onSearch(term);
  };

  // Renderizamos un formulario con el input de búsqueda y el botón.
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Input controlado de búsqueda */}
      <input
        type="text"
        value={term} // el valor lo controla el estado "term".
        onChange={(e) => setTerm(e.target.value)} // al escribir, actualizamos el estado.
        placeholder="Buscar productos…"
        className="flex-1 rounded border border-gray-300 px-3 py-2"
      />
      {/* Botón de envío del formulario */}
      <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Buscar
      </button>
    </form>
  );
}
