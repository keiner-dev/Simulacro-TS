// Importamos la utilidad para gestionar el token en el storage.
import { tokenStorage } from "@/lib/tokenStorage";
// Importamos la capa de peticiones tipada request.
import { request } from "@/lib/api";
// Importamos los tipos necesarios (import type por verbatimModuleSyntax).
import type { AuthResponse } from "@/types/auth";
import type { LoginCredentials, RegisterCredentials, ChangePassword } from "@/types/auth";

// Función para registrar un nuevo usuario. Devuelve la respuesta de autenticación tipada.
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  // Enviamos POST a /auth/register con las credenciales, tipado como AuthResponse.
  const response = await request<AuthResponse>("post", "/auth/register", credentials);
  // Si el registro responde con un token, lo guardamos en localStorage para iniciar sesión automática.
  tokenStorage.set(response.accessToken);
  // Devolvemos la respuesta completa (token + usuario).
  return response;
};

// Función para iniciar sesión. Devuelve la respuesta de autenticación tipada.
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Enviamos POST a /auth/login con las credenciales, tipado como AuthResponse.
  const response = await request<AuthResponse>("post", "/auth/login", credentials);
  // Guardamos el token recibido en localStorage para las siguientes peticiones.
  tokenStorage.set(response.accessToken);
  // Devolvemos la respuesta completa (token + usuario).
  return response;
};

// Función para cerrar sesión. Llama al endpoint de logout y limpia el token del storage.
export const logout = async (): Promise<void> => {
  // Nota: el token JWT es "stateless", /auth/logout sirve como confirmación explícita.
  // Llamamos al endpoint (se puede ignorar el error si el servidor no responde).
  try {
    // Enviamos POST a /auth/logout para confirmación en el servidor.
    await request<{ message: string }>("post", "/auth/logout");
  } finally {
    // En finally (pase lo que pase) eliminamos el token del storage para cerrar sesión localmente.
    tokenStorage.remove();
  }
};

// Función para actualizar la contraseña del usuario autenticado.
export const updatePassword = async (credentials: ChangePassword): Promise<{ message: string }> => {
  // Enviamos PATCH a /users/me/password con las credenciales de cambio.
  return request<{ message: string }>("patch", "/users/me/password", credentials);
};
