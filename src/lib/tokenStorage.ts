// Definimos el nombre de la clave que usaremos en localStorage para guardar el token de sesión.
// La mantenemos en una constante para no repetir el string "accessToken" por todo el código
// y evitar errores de escritura (typos) en el nombre de la clave.
export const TOKEN_KEY = "accessToken";

// Creamos un objeto tokenStorage que encapsula toda la lógica de lectura/escritura del token.
// Al centralizarlo, si mañana cambiamos de storage (p. ej. sessionStorage) solo tocamos este archivo.
// Decidimos usar localStorage (y no sessionStorage) porque así la sesión persiste aunque
// el usuario cierre la pestaña o el navegador, siempre que el token siga vigente. Esto encaja
// con el requisito de "al recargar la página la sesión persiste".
export const tokenStorage = {
  // Método get: devuelve el token almacenado, o null si no existe.
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  // Método set: guarda el token recibido en localStorage con la clave definida.
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  // Método remove: elimina el token de localStorage (para cerrar sesión).
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};
