// Importamos React Router para redirigir a las rutas de login y home.
import { Navigate, Outlet, useLocation } from "react-router-dom";
// Importamos el hook useAuth para conocer el estado de autenticación y el rol.
import { useAuth } from "@/context/auth-context";
// Importamos el tipo Role para las props restringidas por rol.
import type { Role } from "@/types/user";

// Interface con las props que recibe el componente ProtectedRoute.
// - requireAuth: si true, exige que haya un usuario autenticado.
// - allowedRoles: lista opcional de roles permitidos (RBAC). Si se pasa,
//   el usuario debe tener uno de esos roles para entrar.
interface ProtectedRouteProps {
  requireAuth?: boolean; // si se requiere sesión iniciada (opcional, default false).
  allowedRoles?: Role[]; // roles permitidos (opcional).
}

// Componente que protege rutas en dos niveles:
// 1) Autenticación (requireAuth): redirige al login si no hay usuario.
// 2) Autorización por rol (allowedRoles): redirige al home si el rol no coincide.
// Usa <Outlet> para renderizar las rutas hijas anidadas en la configuración de rutas.
export default function ProtectedRoute({ requireAuth = false, allowedRoles }: ProtectedRouteProps) {
  // Obtenemos el usuario, su rol y el estado de carga desde el contexto de autenticación.
  const { user, role, isLoading } = useAuth();
  // useLocation nos da la ruta actual (la usaremos para "remember" a dónde ir tras login).
  const location = useLocation();

  // Mientras verificamos la sesión al cargar, mostramos un mensaje de carga
  // para no redirigir erróneamente antes de saber si hay sesión.
  if (isLoading) {
    // Retornamos un texto simple de carga mientras se valida la sesión.
    return <div className="p-8 text-center">Cargando…</div>;
  }

  // Si requireAuth es true y no hay usuario autenticado:
  if (requireAuth && !user) {
    // Redirigimos al login. Usamos state.from para recordar la ruta a la que
    // el usuario quería ir y poder redirigirlo de vuelta tras iniciar sesión.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si se definieron allowedRoles y el rol del usuario NO está en la lista:
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirigimos al home: el usuario no tiene permiso para esta ruta.
    // Esto aplica la regla de "redirigido por URL directa, no solo ocultar el botón".
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizamos las rutas hijas con <Outlet>.
  return <Outlet />;
}
