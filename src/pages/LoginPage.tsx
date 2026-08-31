// Importamos useState y FormEvent para el formulario controlado de login.
import { useState, type FormEvent } from "react";
// Importamos hooks de React Router para navegar y leer la ruta de origen.
import { useNavigate, useLocation, Link } from "react-router-dom";
// Importamos el hook de autenticación.
import { useAuth } from "@/context/auth-context";
// Importamos el componente de mensaje de error.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos ApiError para clasificar errores de la API.
import { ApiError } from "@/lib/errors";

// Componente de la página de inicio de sesión (formulario controlado).
export default function LoginPage() {
  // Estado controlado para el email.
  const [email, setEmail] = useState("");
  // Estado controlado para la contraseña.
  const [password, setPassword] = useState("");
  // Estado para mostrar errores (de validación o de la API).
  const [error, setError] = useState("");
  // Estado para deshabilitar el botón durante el envío.
  const [submitting, setSubmitting] = useState(false);

  // Obtenemos la función login del contexto de autenticación.
  const { login } = useAuth();
  // useNavigate para redirigir tras el login.
  const navigate = useNavigate();
  // useLocation para leer a dónde quería ir el usuario (from) y redirigirlo de vuelta.
  const location = useLocation();

  // Función que maneja el envío del formulario.
  const handleSubmit = async (e: FormEvent) => {
    // Evitamos el recargado de la página.
    e.preventDefault();
    // Reseteamos el error anterior.
    setError("");
    // Activamos el estado de envío.
    setSubmitting(true);
    try {
      // Llamamos a login con las credenciales del formulario.
      await login({ email, password });
      // Obtenemos la ruta desde donde venía el usuario (o "/" por defecto).
      const from = (location.state as { from?: Location })?.from?.pathname ?? "/";
      // Redirigimos al usuario a la ruta original (o al home).
      navigate(from, { replace: true });
    } catch (err) {
      // Si es un error de la API lo clasificamos para mostrar el mensaje adecuado.
      if (err instanceof ApiError) {
        // Según el tipo de error mostramos un mensaje distinto al usuario.
        if (err.kind === "unauthorized") {
          setError("Credenciales incorrectas."); // 401: mal email o password.
        } else if (err.kind === "validation") {
          setError(err.message); // 400: error de formato.
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor."); // red: backend caído.
        } else {
          setError(err.message || "Error al iniciar sesión."); // cualquier otro.
        }
      } else {
        // Si no es ApiError, mostramos un mensaje genérico.
        setError("Error al iniciar sesión.");
      }
    } finally {
      // En finally apagamos el estado de envío.
      setSubmitting(false);
    }
  };

  // Renderizamos el formulario de login controlado.
  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Título del formulario */}
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>

      {/* Mostramos el error (si ocurrió) */}
      {error && <ErrorMessage message={error} />}

      {/* Formulario controlado */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo email */}
        <div>
          {/* htmlFor asocia la etiqueta con el input mediante su id (accesibilidad y testing) */}
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>

      {/* Enlace al registro para usuarios sin cuenta */}
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="text-blue-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
