// Importamos la capa de peticiones tipada.
import { request } from "@/lib/api";
// Importamos los tipos de Producto, la respuesta paginada, los query params y el payload.
import type { Product, PaginatedResponse, ProductQueryParams, ProductPayload } from "@/types/product";

// Función para listar productos con paginación, búsqueda y filtro por categoría.
// Usa los query params que expone la API: search, categoryId, page, limit.
export const getProducts = async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
  // Construimos una URL con los query params. Usamos URLSearchParams para codificar
  // correctamente los valores y omitir los que son undefined.
  const query = new URLSearchParams();
  // Si hay término de búsqueda, lo agregamos al query.
  if (params.search) query.set("search", params.search);
  // Si hay filtro de categoría, lo agregamos al query.
  if (params.categoryId) query.set("categoryId", params.categoryId);
  // Si hay página, la agregamos (convertimos a string).
  if (params.page) query.set("page", String(params.page));
  // Si hay límite, lo agregamos (convertimos a string).
  if (params.limit) query.set("limit", String(params.limit));
  // Construimos el string del query (con "?" si hay parámetros, o vacío si no).
  const qs = query.toString();
  // Hacemos GET /products?<query> tipado como PaginatedResponse<Product>.
  return request<PaginatedResponse<Product>>("get", `/products${qs ? `?${qs}` : ""}`);
};

// Función para obtener el detalle de un producto por id (endpoint público).
export const getProduct = async (id: string): Promise<Product> => {
  // Hacemos GET /products/:id tipado como Product.
  return request<Product>("get", `/products/${id}`);
};

// Función para crear un producto (requiere JWT).
export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  // Hacemos POST /products con el payload, tipado como Product.
  return request<Product>("post", "/products", payload);
};

// Función para actualizar un producto (requiere JWT).
export const updateProduct = async (id: string, payload: ProductPayload): Promise<Product> => {
  // Hacemos PATCH /products/:id con el payload, tipado como Product.
  return request<Product>("patch", `/products/${id}`, payload);
};

// Función para eliminar un producto (requiere JWT). No devuelve contenido (204).
export const deleteProduct = async (id: string): Promise<void> => {
  // Hacemos DELETE /products/:id. Tipamos como void porque el 204 no tiene body.
  await request<void>("delete", `/products/${id}`);
};
