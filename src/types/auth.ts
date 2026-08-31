// Importamos el tipo UserResponse desde "./user" (usamos import type por verbatimModuleSyntax).
import type { UserResponse } from "./user";

// Interface con las credenciales para registrar un nuevo usuario (RegisterDto de la API).
export interface RegisterCredentials {
  // name: nombre completo del usuario.
  name: string;
  // email: correo electrónico.
  email: string;
  // password: contraseña (mínimo 6 caracteres según la API).
  password: string;
}

// Type para las credenciales de login. Usamos Omit<RegisterCredentials, 'name'>:
// un utility type que crea un nuevo tipo igual a RegisterCredentials pero SIN la propiedad 'name'.
// Así el login no pide nombre, solo email y password, sin repetir definiciones.
export type LoginCredentials = Omit<RegisterCredentials, "name">;

// Interface para la respuesta de autenticación (AuthResponseDto de la API).
// Es lo que devuelven tanto /auth/register como /auth/login: un token + el usuario.
export interface AuthResponse {
  // accessToken: el token JWT que usaremos en Authorization: Bearer <token>.
  accessToken: string;
  // user: el usuario autenticado (reutilizamos UserResponse).
  user: UserResponse;
}

// Interface para el cambio de contraseña (ChangePasswordDto de la API).
export interface ChangePassword {
  // currentPassword: la contraseña actual (para verificar identidad).
  currentPassword: string;
  // newPassword: la nueva contraseña a establecer.
  newPassword: string;
}
