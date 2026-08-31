// Importamos los hooks de React necesarios para el proveedor de contexto.
import {
  useEffect, // hook para ejecutar lógica en montaje (verificar sesión).
  useState, // hook para estado local (guardar usuario).
  type ReactNode, // tipo para los hijos que recibe el proveedor.
} from "react";
// Importamos el objeto de contexto y su tipo desde el archivo separado (auth-context).
// Al tener el contexto y el hook en otro archivo (sin JSX de componentes), este archivo
// solo exporta el componente AuthProvider y cumple la regla de fast-refresh de React.
import { AuthContext, type AuthContextValue } from "./auth-context";
// Importamos el servicio de autenticación.
import * as authService from "@/services/authService";
// Importamos la instancia de axios para validar la sesión con el token guardado.
import { api } from "@/lib/api";
// Importamos la utilidad del storage del token.
import { tokenStorage } from "@/lib/tokenStorage";
// Importamos tipos necesarios.
import type { UserResponse } from "@/types/user";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";

// Provider: el componente que envuelve la app y provee el valor de autenticación.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado con el usuario autenticado (inicia en null porque asumimos que no hay sesión).
  const [user, setUser] = useState<UserResponse | null>(null);
  // Estado para controlar si estamos verificando la sesión al cargar.
  const [isLoading, setIsLoading] = useState(true);

  // Efecto de montaje: al cargar la app, si hay un token guardado, intentamos
  // recuperar el usuario con GET /users/me. Esto permite que la sesión persista
  // al recargar la página mientras el token siga vigente.
  useEffect(() => {
    // Definimos una función asíncrona para verificar la sesión.
    const loadSession = async () => {
      // Obtenemos el token guardado.
      const token = tokenStorage.get();
      // Si NO hay token, no hay sesión: dejamos user en null y terminamos la carga.
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // Si hay token, pedimos el perfil del usuario autenticado (el interceptor
        // de axios ya agrega el Authorization: Bearer <token> automáticamente).
        const me = await api.get<UserResponse>("/users/me");
        // Guardamos el usuario en el estado.
        setUser(me.data);
      } catch {
        // Si falla (token inválido/expirado), el interceptor de 401 ya limpió el token.
        // Aquí simplemente aseguramos que el usuario quede null.
        setUser(null);
      } finally {
        // Pase lo que pase, terminamos la carga.
        setIsLoading(false);
      }
    };
    // Ejecutamos la verificación de sesión al montar el componente.
    loadSession();
    // Dependencia vacía: solo se ejecuta una vez al montar.
  }, []);

  // Función login: llama al servicio, guarda token+usuario en el estado.
  const handleLogin = async (credentials: LoginCredentials) => {
    // Llamamos al servicio login (que también guarda el token en localStorage).
    const response = await authService.login(credentials);
    // Guardamos el usuario devuelto en el estado del contexto.
    setUser(response.user);
  };

  // Función logout: llama al servicio (limpia token) y resetea el usuario en el estado.
  const handleLogout = async () => {
    // Llamamos al servicio logout (limpia el storage y llama /auth/logout).
    await authService.logout();
    // Ponemos el usuario del contexto en null.
    setUser(null);
  };

  // Función register: crea la cuenta y establece la sesión con el usuario devuelto.
  const handleRegister = async (credentials: RegisterCredentials) => {
    // Llamamos al servicio register (que guarda el token y devuelve token+usuario).
    const response = await authService.register(credentials);
    // Guardamos el usuario devuelto en el estado del contexto (sesión iniciada).
    setUser(response.user);
  };

  // Construimos el valor que se va a exponer a través del contexto.
  const value: AuthContextValue = {
    user: user, // el usuario actual (o null).
    role: user ? user.role : null, // el rol derivado del usuario (o null).
    isLoading: isLoading, // si estamos verificando la sesión.
    login: handleLogin, // la función de login.
    register: handleRegister, // la función de registro.
    logout: handleLogout, // la función de logout.
  };

  // Retornamos el proveedor con el valor calculado y los hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
