// Importamos la utilidad para leer/escribir el token en el storage del navegador.
import { tokenStorage } from "@/lib/tokenStorage";
// Importamos axios (la librería HTTP que usamos para las peticiones).
import axios from "axios";
// Importamos nuestra clase de error personalizada y la función que clasifica errores.
import { ApiError, toApiError } from "./errors";

// Creamos una instancia de Axios con la URL base de la API.
export const api = axios.create({
  // Establecemos la URL base de la API a partir de una variable de entorno o un valor por defecto.
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

// Interceptor para agregar el token de autorización a las solicitudes.
api.interceptors.request.use((config) => {
  // Obtenemos el token del almacenamiento local.
  const token = tokenStorage.get();
  // Si existe un token, lo agregamos a los encabezados de la solicitud.
  if (token) {
    // Agregamos el token al encabezado de autorización con el formato "Bearer <token>".
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Retornamos la configuración de la solicitud (ya con el token).
  return config;
});

// Interceptor para manejar respuestas de la API.
api.interceptors.response.use(
  // Si la respuesta es exitosa, la retornamos sin modificar.
  (response) => response,
  // Si ocurre un error en la respuesta:
  (error) => {
    // Si el error es un 401 (no autorizado), el token ha expirado o es inválido.
    if (error?.response?.status === 401) {
      // Eliminamos el token del almacenamiento local (cerramos sesión localmente).
      tokenStorage.remove();
      // Redirigimos al usuario a la página de login.
      window.location.href = "auth/login";
    }
    // Rechazamos la promesa con el error para que sea manejado por el código que hizo la solicitud.
    return Promise.reject(error);
  }
);

// Exportamos por defecto la instancia de Axios para usarla en otros archivos.
export default api;

// --- Capa de peticiones tipada con genéricos ---
// Esta función genérica "request" es una capa de fetch tipada: recibe un tipo T y
// devuelve una promesa que resuelve con datos de ese tipo T. Así nunca trabajamos
// con "any": el código sabe exactamente qué forma tienen los datos.
// Además centraliza el manejo de errores (red vs validación vs autorización)
// en un solo lugar, convirtiendo cualquier error en un ApiError clasificado.
export async function request<T>(
  method: "get" | "post" | "patch" | "delete", // el verbo HTTP permitido
  url: string, // la ruta del endpoint (ej. "/products")
  data?: unknown // el cuerpo a enviar en POST/PATCH (opcional)
): Promise<T> {
  // try/catch/finally: intentamos la petición y capturamos cualquier error.
  try {
    // Realizamos la petición con la instancia de axios y tipamos la respuesta como T.
    const response = await api.request<T>({ method, url, data });
    // Devolvemos únicamente el body (response.data), ya tipado como T.
    return response.data;
  } catch (error) {
    // Si el error ya es un ApiError, lo re-lanzamos tal cual para no perder su categoría.
    if (error instanceof ApiError) throw error;
    // Si es un error de Axios (axios.isAxiosError comprueba esto), lo clasificamos.
    if (axios.isAxiosError(error)) {
      // Obtenemos el status HTTP de la respuesta (si existe).
      const status = error.response?.status;
      // Obtenemos el mensaje crudo que devuelve el servidor (NestJS suele usar "message").
      const rawMessage = error.response?.data?.message;
      // Si no hay status, significa que no hubo respuesta del servidor = error de red.
      if (status === undefined) {
        // Lanzamos un ApiError de categoría "network" con un mensaje amigable.
        throw new ApiError("network", "No se pudo conectar con el servidor");
      }
      // Convierte el mensaje crudo a string: si es un array (como devuelven las
      // validaciones de Nest), los unimos con ", " ; si no, usamos el mensaje o un genérico.
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ") // unimos los mensajes de validación en uno solo
        : (rawMessage ?? `Error ${status}`); // o usamos el mensaje directo / genérico
      // Lanzamos un ApiError clasificado según el status con ApiError.fromStatus.
      throw ApiError.fromStatus(status, message, error.response?.data);
    }
    // Cualquier otro error desconocido lo convertimos a ApiError con toApiError.
    throw toApiError(error);
  }
}
