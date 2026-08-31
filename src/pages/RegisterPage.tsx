// Importamos useState y FormEvent para el formulario controlado de registro.
import { useState, type FormEvent } from "react";
// Importamos hooks de React Router para navegar y enlazar.
import { useNavigate, Link } from "react-router-dom";
// Importamos el componente de mensaje de error.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos ApiError para clasificar errores de la API.
import { ApiError } from "@/lib/errors";
// Importamos el contexto de autenticación (para registrar e iniciar sesión automáticamente).
import { useAuth } from "@/context/auth-context";

// Componente de la página de registro (formulario controlado).
export default function RegisterPage() {
  // Estado controlado: nombre.
  const [name, setName] = useState("");
  // Estado controlado: email.
  const [email, setEmail] = useState("");
  // Estado controlado: contraseña.
  const [password, setPassword] = useState("");
  // Estado para mostrar errores (validación o de la API).
  const [error, setError] = useState("");
  // Estado para deshabilitar el botón durante el envío.
  const [submitting, setSubmitting] = useState(false);

  // useAuth: obtenemos la función register (que además inicia sesión automáticamente).
  const { register } = useAuth();
  // useNavigate para redirigir al home tras registrarse.
  const navigate = useNavigate();

  // Función que maneja el envío del formulario de registro.
  const handleSubmit = async (e: FormEvent) => {
    // Evitamos el recargado de la página.
    e.preventDefault();
    // Reseteamos el error anterior.
    setError("");
    // Activamos el estado de envío.
    setSubmitting(true);

    try {
      // Llamamos a register (contexto) con el nombre, email y contraseña.
      // El contexto guarda el token y establece el usuario (sesión iniciada).
      await register({ name, email, password });
      // Si el registro fue exitoso, redirigimos al home con sesión ya iniciada.
      navigate("/");
    } catch (err) {
      // Si es un error de la API lo clasificamos.
      if (err instanceof ApiError) {
        // 409 = el email ya está registrado.
        if (err.kind === "conflict") {
          setError("El correo ya está registrado.");
        } else if (err.kind === "validation") {
          setError(err.message); // 400: datos inválidos (ej. contraseña corta).
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor.");
        } else {
          setError(err.message || "Error al registrarse.");
        }
      } else {
        // Mensaje genérico si no es ApiError.
        setError("Error al registrarse.");
      }
    } finally {
      // Apagamos el estado de envío.
      setSubmitting(false);
    }
  };

  // Renderizamos el formulario de registro controlado.
  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Título */}
      <h1 className="mb-6 text-2xl font-bold">Registrarse</h1>

      {/* Errores */}
      {error && <ErrorMessage message={error} />}

      {/* Formulario controlado */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo nombre */}
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Campo email */}
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Campo contraseña */}
        <div>
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Registrando…" : "Registrarse"}
        </button>
      </form>

      {/* Enlace al login */}
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
