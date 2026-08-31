// Importamos React Router para navegar al detalle del producto.
import { Link } from "react-router-dom";
// Importamos el tipo Product.
import type { Product } from "@/types/product";
// Importamos la utilidad que nos da la primera imagen de forma segura.
import { firstImage, formatPrice } from "@/utils/format";
// Importamos el botón de favorito (lo mostraremos dentro de la tarjeta).
import FavoriteButton from "./FavoriteButton";

// Interface con las props: el producto a mostrar y opcionalmente un callback de cambio
// de favoritos para refrescar listas desde el padre.
interface ProductCardProps {
  // product: el producto que se renderiza.
  product: Product;
  // isFavorited: indica si el producto está en favoritos (controla el corazón lleno/vacío).
  isFavorited?: boolean;
  // onFavoritesChange (opcional): función que se llama al cambiar un favorito
  // (para que el padre actualice su estado sin recargar la página).
  onFavoritesChange?: () => void;
}

// Componente que renderiza una tarjeta de producto (se usa en listados y home).
export default function ProductCard({ product, isFavorited = false, onFavoritesChange }: ProductCardProps) {
  // Obtenemos la primera imagen del producto de forma segura (puede ser undefined).
  const image = firstImage(product.images);

  // Renderizamos la tarjeta como un contenedor con borde/redondeo.
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Enlace a la imagen: al hacer clic navega al detalle del producto */}
      <Link to={`/productos/${product.id}`} className="block h-48 bg-gray-100">
        {/* Si hay imagen, la mostramos con onError para no romper el layout en caso de URL rota */}
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover"
            // onError: si la URL falla al cargar, ocultamos la imagen (no rompe el layout).
            onError={(e) => {
              // Al dispararse el error de carga, ocultamos el elemento img.
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          // Si no hay imagen, mostramos un placeholder con el nombre del producto.
          <div className="flex h-full items-center justify-center text-gray-400">{product.name}</div>
        )}
      </Link>
      {/* Cuerpo de la tarjeta con la información del producto */}
      <div className="flex flex-1 flex-col p-4">
        {/* Nombre del producto (enlaza al detalle) */}
        <Link to={`/productos/${product.id}`} className="font-semibold hover:underline">
          {product.name}
        </Link>
        {/* Nombre de la categoría (si viene disponible) */}
        {product.category?.name && <span className="text-xs text-gray-500">{product.category.name}</span>}
        {/* Precio formateado */}
        <p className="mt-2 text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
        {/* Stock: si es 0 mostramos "Agotado" */}
        <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
        </p>
        {/* Pie de la tarjeta: botón de favorito (se alinea abajo con mt-auto) */}
        <div className="mt-auto pt-3">
          {/* Botón de favorito (visible solo para autenticados, gestiona su propio estado) */}
          <FavoriteButton productId={product.id} isFavorited={isFavorited} onChange={onFavoritesChange} />
        </div>
      </div>
    </div>
  );
}
