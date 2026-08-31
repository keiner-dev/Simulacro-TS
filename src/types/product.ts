// Importamos el tipo Category (relación anidada que a veces devuelve la API).
import type { Category } from "./category";

// Type del dominio para un Producto, según lo que devuelve el backend.
export interface Product {
  // id: identificador único del producto (UUID -> string).
  id: string;
  // name: nombre del producto (obligatorio).
  name: string;
  // description: descripción del producto (opcional).
  description?: string;
  // price: precio en la moneda local, sin símbolo (número).
  price: number;
  // stock: unidades disponibles en inventario (número).
  stock: number;
  // categoryId: id de la categoría a la que pertenece (obligatorio en CreateProductDto).
  categoryId: string;
  // category: la categoría completa anidada. Opcional porque la API solo la incluye
  // en algunos endpoints (ej. detalle), no siempre.
  category?: Category;
  // images: arreglo de URLs de las imágenes del producto (opcional).
  images?: string[];
  // createdAt: fecha de creación (string ISO).
  createdAt: string;
}

// Type genérico para la respuesta paginada de la API.
// Usamos <T> para que sea reutilizable con cualquier tipo de dato: `PaginatedResponse<Product>`,
// `PaginatedResponse<Category>`, etc. Así no repetimos la forma `{ data, total, ... }` a mano.
export interface PaginatedResponse<T> {
  // data: arreglo de elementos de tipo T (la página solicitada).
  data: T[];
  // total: cantidad total de registros en toda la base (no solo la página).
  total: number;
  // page: número de página actual.
  page: number;
  // limit: cantidad de registros por página.
  limit: number;
  // totalPages: cantidad total de páginas (se calcula en el backend con total/limit).
  totalPages: number;
}

// Type con los query params que acepta el endpoint GET /products.
// Todos opcionales, porque cada uno filtra/condiciona la lista de forma independiente.
export interface ProductQueryParams {
  // search: texto de búsqueda por nombre o descripción.
  search?: string;
  // categoryId: filtra productos por categoría.
  categoryId?: string;
  // page: número de página a pedir.
  page?: number;
  // limit: cantidad de productos por página.
  limit?: number;
}

// Interface con los datos para crear/actualizar un producto (CreateProductDto).
// Aquí usamos tipos "broad" (string para price y stock) porque en el formulario los
// inputs de texto devuelven strings que luego el formulario convierte a número.
export interface ProductPayload {
  // name: nombre del producto (obligatorio).
  name: string;
  // description: descripción opcional.
  description?: string;
  // price: precio del producto (string en el formulario, se convierte a número al enviar).
  price: string | number;
  // stock: stock disponible (string en el formulario, se convierte a número al enviar).
  stock: string | number;
  // categoryId: id de la categoría (obligatorio).
  categoryId: string;
  // images: arreglo de URLs de imágenes (opcional).
  images?: string[];
}
