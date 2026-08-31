// Importamos el tipo Product (cada favorito incluye el producto completo anidado).
import type { Product } from "./product";

// Type del dominio para un Favorito, según lo que devuelve GET /favorites.
export interface Favorite {
  // id: identificador único de la relación favorito.
  id: string;
  // productId: id del producto marcado como favorito.
  productId: string;
  // userId: id del usuario que marcó el favorito.
  userId: string;
  // product: el producto completo guardado como favorito. La API lo devuelve anidado.
  product: Product;
  // createdAt: fecha en que se guardó el favorito (string ISO).
  createdAt: string;
}
