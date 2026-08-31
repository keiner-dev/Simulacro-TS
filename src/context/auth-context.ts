// Importamos los hooks de React necesarios: createContext (crea el contexto) y
// useContext (hook para leerlo). No hay JSX aquí, solo lógica de contexto.
import { createContext, useContext } from "react";
// Importamos tipos necesarios (import type por verbatimModuleSyntax).
import type { UserResponse } from "@/types/user";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";

// Interfaz que define la forma del valor que expone el contexto de autenticación.
// Se define aquí (y no en AuthContext.tsx) para poder reutilizarla tanto en el
// archivo del contexto como en el proveedor, manteniendo separada la parte de UI.
export interface AuthContextValue {
  // user: el usuario autenticado, o null si no hay sesión.
  user: UserResponse | null;
  // role: el rol del usuario autenticado, o null si no hay sesión. Se usa para RBAC.
  role: UserResponse["role"] | null;
  // isLoading: true mientras verificamos la sesión al cargar la app (evita parpadeo).
  isLoading: boolean;
  // login: función que recibe credenciales y establece la sesión.
  login: (credentials: LoginCredentials) => Promise<void>;
  // register: función que crea la cuenta y establece la sesión automáticamente.
  register: (credentials: RegisterCredentials) => Promise<void>;
  // logout: función que cierra la sesión y limpia el estado.
  logout: () => Promise<void>;
}

// Creamos el contexto con un valor inicial undefined (aún no hay sesión).
// El tipo es AuthContextValue | undefined para poder detectar si se usa fuera del proveedor.
// Lo aislamos en este archivo (sin componentes JSX) para cumplir la regla de
// fast-refresh de React (un archivo solo debe exportar componentes o solo no-componentes).
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Hook personalizado useAuth: lee el contexto de autenticación.
// Es la forma cómoda de acceder al valor desde cualquier componente hijo.
export function useAuth(): AuthContextValue {
  // Leemos el contexto.
  const context = useContext(AuthContext);
  // Si el contexto es undefined, significa que se usó fuera del AuthProvider:
  // lanzamos un error claro para evitar bugs silenciosos.
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  // Devolvemos el contexto con el valor de autenticación.
  return context;
}
