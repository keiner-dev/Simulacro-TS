// Archivo de utilidades puras (funciones sin dependencias de React).
// Las funciones puras son ideales para pruebas unitarias porque son predecibles.

// Función pura: formatea un número de precio a una cadena con moneda local.
// Recibe el precio numérico y el código de moneda (default "COP" - pesos colombianos,
// que es donde la app se usa, según la API "moneda local").
// Es "pura": dado el mismo input siempre devuelve el mismo output y no modifica nada externo.
export function formatPrice(price: number, currency: string = "COP"): string {
  // Usamos Intl.NumberFormat para formatear el número según el locale es-CO
  // con el estilo de moneda dado. Esto añade separadores de miles y el símbolo/ISO.
  return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(price);
}

// Función pura: convierte una lista de URLs de imagen en un arreglo seguro.
// La usamos para manejar el caso de imágenes vacías/rotas sin que rompan el layout.
// Recibe la lista de imágenes (opcional) y devuelve siempre un arreglo de strings.
export function safeImages(images?: string[]): string[] {
  // Si images es undefined o null, retornamos un arreglo vacío; si no, lo retornamos tal cual.
  return images ?? [];
}

// Función pura: devuelve la primera imagen útil de un producto (o undefined si no hay).
// Nos sirve como fallback para las tarjetas, evitando romper el layout con URLs rotas.
export function firstImage(images?: string[]): string | undefined {
  // Obtenemos la lista segura y retornamos el primer elemento (o undefined si está vacío).
  return safeImages(images)[0];
}
