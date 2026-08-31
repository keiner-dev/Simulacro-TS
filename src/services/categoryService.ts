// Importamos la capa de peticiones tipada.
import { request } from "@/lib/api";
// Importamos los tipos de Categoría.
import type { Category } from "@/types/category";

// Interface con los datos para crear/actualizar una categoría (CreateCategoryDto).
export interface CategoryPayload {
  // name: nombre obligatorio de la categoría.
  name: string;
  // description: descripción opcional de la categoría.
  description?: string;
}

// Función para listar todas las categorías (endpoint público, no requiere token).
export const getCategories = async (): Promise<Category[]> => {
  // Hacemos GET /categories tipado como arreglo de Category.
  return request<Category[]>("get", "/categories");
};

// Función para obtener una categoría por su id (endpoint público).
export const getCategory = async (id: string): Promise<Category> => {
  // Hacemos GET /categories/:id tipado como Category.
  return request<Category>("get", `/categories/${id}`);
};

// Función para crear una categoría (requiere JWT y rol admin).
export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  // Hacemos POST /categories con el payload, tipado como Category.
  return request<Category>("post", "/categories", payload);
};

// Función para actualizar una categoría (requiere JWT y rol admin).
export const updateCategory = async (id: string, payload: CategoryPayload): Promise<Category> => {
  // Hacemos PATCH /categories/:id con el payload, tipado como Category.
  return request<Category>("patch", `/categories/${id}`, payload);
};

// Función para eliminar una categoría (requiere JWT y rol admin). No devuelve contenido (204).
export const deleteCategory = async (id: string): Promise<void> => {
  // Hacemos DELETE /categories/:id. Tipamos como void porque el 204 no tiene body.
  await request<void>("delete", `/categories/${id}`);
};
