// Definimos los posibles tipos (categorías) de error que puede devolver nuestra aplicación.
// Es una unión de literales: cada caso representa una circunstancia concreta y distinta de fallo.
// - network      : no hubo respuesta del backend (servidor caído, sin internet, etc.).
// - validation   : el backend rechazó los datos enviados (HTTP 400 / 422).
// - unauthorized : el token no es válido o expiró (HTTP 401).
// - forbidden    : el usuario no tiene permisos para esa acción (HTTP 403).
// - notFound     : el recurso solicitado no existe (HTTP 404).
// - conflict     : conflicto de estado (ej. ya estaba en favoritos) (HTTP 409).
// - unknown      : cualquier otro error no previsto.
export type ApiErrorKind =
  | "network"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "unknown";

// Clase personalizada de error. Objetivo: que el código que la capture pueda saber,
// de forma programática (leyendo la propiedad "kind"), qué clase de error ocurrió,
// y mostrar al usuario el mensaje adecuado. Por eso sí está justificado usar una clase aquí.
export class ApiError extends Error {
  // kind: categoría semántica del error (network, validation, autorización, etc.).
  public readonly kind: ApiErrorKind;
  // status: código HTTP de la respuesta del servidor (undefined si fue error de red).
  public readonly status?: number;
  // details: la respuesta completa del servidor (por si queremos inspeccionarla).
  public readonly details?: unknown;

  // Constructor de la clase: recibe la categoría, el mensaje, el status HTTP (opcional)
  // y los detalles (opcional). Llama al constructor de Error usando super(message).
  constructor(kind: ApiErrorKind, message: string, status?: number, details?: unknown) {
    // Llamamos al constructor de la clase Error de JavaScript (la clase padre).
    super(message);
    // Asignamos el nombre del error para distinguirlo en la consola/logs.
    this.name = "ApiError";
    // Guardamos la categoría que recibimos.
    this.kind = kind;
    // Guardamos el status HTTP (si viene).
    this.status = status;
    // Guardamos los detalles (si vienen).
    this.details = details;
  }

  // Método estático: a partir de un status HTTP numérico, determina la categoría (kind)
  // correspondiente y construye un ApiError. Es el lugar central donde mapeamos
  // números de status a nuestras categorías semánticas.
  static fromStatus(status: number, message: string, details?: unknown): ApiError {
    // Contestación: comparamos el status recibido y decidimos el kind adecuado.
    const kind: ApiErrorKind =
      status === 400 || status === 422 // 400 = petición inválida, 422 = validación
        ? "validation" // los tratamos como error de validación
        : status === 401 // 401 = no autenticado (token inválido/expirado)
          ? "unauthorized" // categoría de no autorizado
          : status === 403 // 403 = autenticado pero sin permisos
            ? "forbidden" // categoría de prohibido
            : status === 404 // 404 = recurso no encontrado
              ? "notFound" // categoría de no encontrado
              : status === 409 // 409 = conflicto de estado
                ? "conflict" // categoría de conflicto
                : "unknown"; // cualquier otro status cae en desconocido

    // Construimos y devolvemos el ApiError con la categoría elegida.
    return new ApiError(kind, message, status, details);
  }
}

// Función auxiliar: convierte cualquier "unknown" (lo que capturamos en un catch)
// en un ApiError seguro. Si ya era un ApiError lo devuelve tal cual (para no
// perder su categoría). Si no, construye un ApiError de categoría "unknown".
export function toApiError(error: unknown): ApiError {
  // Si el error ya es una instancia de ApiError, lo retornamos sin modificarlo.
  if (error instanceof ApiError) return error;
  // Si es un Error normal de JavaScript, usamos su mensaje; si no, mensaje genérico.
  const message = error instanceof Error ? error.message : "Error inesperado";
  // Devolvemos un ApiError con categoría desconocida y el mensaje obtenido.
  return new ApiError("unknown", message);
}
