// Importamos la capa de peticiones tipada.
import { request } from "@/lib/api";
// Importamos el tipo Favorite.
import type { Favorite } from "@/types/favorites";

// Función para listar los productos favoritos del usuario autenticado (requiere JWT).
export const getFavorites = async (): Promise<Favorite[]> => {
  // Hacemos GET /favorites tipado como arreglo de Favorite.
  return request<Favorite[]>("get", "/favorites");
};

// Función para agregar un producto a favoritos (requiere JWT, devuelve 201).
export const addFavorite = async (productId: string): Promise<void> => {
  // Hacemos POST /favorites/:productId. Tipamos como void (el 201 no nos interesa su body).
  await request<void>("post", `/favorites/${productId}`);
};

// Función para quitar un producto de favoritos (requiere JWT, devuelve 204).
export const removeFavorite = async (productId: string): Promise<void> => {
  // Hacemos DELETE /favorites/:productId. Tipamos como void (el 204 no tiene body).
  await request<void>("delete", `/favorites/${productId}`);
};
