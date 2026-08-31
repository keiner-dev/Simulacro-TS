// Type avanzado: unión de literales que define los roles válidos de la aplicación.
// Un usuario solo puede ser "admin" o "user". Lo usamos para el RBAC.
export type Role = "admin" | "user";

// Type del dominio para la respuesta del usuario, según UserResponseDto de la API.
export interface UserResponse {
  // id: identificador único del usuario (UUID -> string).
  id: string;
  // name: nombre completo del usuario.
  name: string;
  // email: correo electrónico del usuario.
  email: string;
  // role: rol del usuario (admin o user). Usamos el tipo Role definido arriba.
  role: Role;
  // createdAt: fecha de creación de la cuenta (string ISO).
  createdAt: string;
}

// Interface para el login: solo necesita email y password.
export interface LoginUser {
  // email: correo del usuario.
  email: string;
  // password: contraseña del usuario.
  password: string;
}

// Interface para el registro: hereda de LoginUser (email y password) y agrega name.
export interface RegisterUser extends LoginUser {
  // name: nombre que se pide al registrarse.
  name: string;
}
