// Importamos hooks de React y React Router.
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
// Importamos el servicio de categorías.
import { createCategory } from "@/services/categoryService";
// Importamos componentes de UI.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos ApiError para clasificar errores (403 sin permisos, etc.)
import { ApiError } from "@/lib/errors";

// Componente de la página para CREAR una categoría. Solo accesible para admin
// (lo garantiza la ruta protegida por rol en App.tsx).
export default function CategoryNewPage() {
  // Estado controlado: nombre.
  const [name, setName] = useState("");
  // Estado controlado: descripción (opcional).
  const [description, setDescription] = useState("");
  // Estado para errores.
  const [error, setError] = useState("");
  // Estado de envío.
  const [submitting, setSubmitting] = useState(false);
  // useNavigate para redirigir tras crear.
  const navigate = useNavigate();

  // Función que maneja el envío del formulario.
  const handleSubmit = async (e: FormEvent) => {
    // Evitamos el recargado de página.
    e.preventDefault();
    // Reseteamos el error.
    setError("");
    // Activamos el estado de envío.
    setSubmitting(true);
    try {
      // Llamamos al servicio para crear la categoría.
      await createCategory({ name: name.trim(), description: description.trim() || undefined });
      // Tras crear, redirigimos al listado de categorías.
      navigate("/categorias");
    } catch (err) {
      // Clasificamos el error para mostrar un mensaje claro.
      if (err instanceof ApiError) {
        // 403: el usuario no tiene permisos (esta es la protección por rol real del backend).
        if (err.kind === "forbidden") {
          setError("No tienes permisos de administrador para crear categorías.");
        } else if (err.kind === "validation") {
          setError(err.message);
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor.");
        } else {
          setError(err.message || "No se pudo crear la categoría.");
        }
      } else {
        setError("No se pudo crear la categoría.");
      }
    } finally {
      // Apagamos el estado de envío.
      setSubmitting(false);
    }
  };

  // Renderizamos el formulario controlado.
  return (
    <div className="mx-auto mt-6 max-w-md">
      {/* Enlace para volver */}
      <Link to="/categorias" className="text-blue-600 hover:underline">
        ← Volver
      </Link>
      {/* Tarjeta del formulario */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Crear categoría</h1>

        {/* Errores */}
        {error && <ErrorMessage message={error} />}

        {/* Formulario controlado */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo nombre */}
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {/* Campo descripción (opcional) */}
          <div>
            <label className="mb-1 block text-sm font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {/* Botón de envío */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "Creando…" : "Crear categoría"}
          </button>
        </form>
      </div>
    </div>
  );
}
