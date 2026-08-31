// Importamos React Router para los enlaces de navegación entre páginas.
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
// Importamos el hook useAuth para mostrar opciones según sesión/rol.
import { useAuth } from "@/context/auth-context";

// Componente Layout: envuelve todas las páginas con una barra de navegación superior
// y un contenedor. Usa <Outlet> de react-router para renderizar la página actual.
export default function Layout() {
  // useAuth nos da el usuario y las funciones de login/logout.
  const { user, logout } = useAuth();
  // useNavigate para redirigir tras cerrar sesión.
  const navigate = useNavigate();

  // Función que maneja el cierre de sesión al pulsar el botón.
  const handleLogout = async () => {
    // Llamamos a la función logout del contexto (limpia token y llama al endpoint).
    await logout();
    // Tras cerrar sesión, redirigimos al home.
    navigate("/");
  };

  // Función auxiliar para construir las clases de los enlaces activos del navbar.
  const navClass = ({ isActive }: { isActive: boolean }) =>
    // Si el enlace está activo, texto blanco; si no, texto gris claro. común para hover.
    `px-3 py-2 rounded transition-colors ${isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"}`;

  // Renderizamos el layout: navbar + contenedor con el contenido dinámico.
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Barra de navegación superior */}
      <header className="bg-gray-900 text-white shadow">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo / link a home */}
          <Link to="/" className="text-xl font-bold">
            Gestión de Productos
          </Link>
          {/* Enlaces de navegación principales */}
          <div className="flex items-center gap-2">
            {/* Enlace al listado de productos (home) */}
            <NavLink to="/" end className={navClass}>
              Productos
            </NavLink>
            {/* Enlace a categorías */}
            <NavLink to="/categorias" className={navClass}>
              Categorías
            </NavLink>
            {/* Renderizamos secciones que requieren sesión iniciada */}
            {user && (
              <>
                {/* Enlace a los favoritos (solo autenticados) */}
                <NavLink to="/favoritos" className={navClass}>
                  Mis favoritos
                </NavLink>
                {/* Enlace a crear producto (solo autenticados) */}
                <NavLink to="/productos/nuevo" className={navClass}>
                  Crear producto
                </NavLink>
                {/* Renderizamos la opción de crear categoría SOLO si el usuario es admin */}
                {user.role === "admin" && (
                  <NavLink to="/categorias/nueva" className={navClass}>
                    Crear categoría
                  </NavLink>
                )}
              </>
            )}
          </div>
          {/* Zona de usuario: si hay sesión mostramos nombre + logout, si no, login */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Saludamos al usuario con su nombre */}
                <span className="text-sm text-gray-300">
                  {user.name} ({user.role})
                </span>
                {/* Botón para cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                {/* Enlace a iniciar sesión para usuarios no autenticados */}
                <NavLink to="/login" className={navClass}>
                  Iniciar sesión
                </NavLink>
                {/* Enlace a registrarse para usuarios no autenticados */}
                <NavLink to="/registro" className={navClass}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Contenido principal: `<Outlet>` renderiza la página que corresponda a la ruta */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
