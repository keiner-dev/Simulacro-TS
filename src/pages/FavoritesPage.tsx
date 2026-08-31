// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos componentes.
import ProductCard from "@/components/ProductCard";
import ErrorMessage from "@/components/ErrorMessage";
// Importamos tipos.
import type { Favorite } from "@/types/favorites";

// Componente de la página "Mis favoritos": lista los productos guardados por el usuario.
// Solo accesible para usuarios autenticados (lo garantiza la ruta protegida).
export default function FavoritesPage() {
  // useFetch para obtener los favoritos del usuario actual (requiere JWT).
  const { data: favorites, loading, error, refetch } = useFetch<Favorite[]>("/favorites");

  // Función que se llama al quitar/agregar un favorito: recarga la lista de favoritos
  // para que se actualice sin necesidad de recargar la página (criterio del Módulo 5).
  const handleFavoritesChange = () => {
    // Refresca los favoritos desde el servidor.
    refetch();
  };

  // Renderizamos la página.
  return (
    <div>
      {/* Título */}
      <h1 className="mb-6 text-2xl font-bold">Mis favoritos</h1>

      {/* Renderizado condicional: cargando / error / vacío / datos */}
      {loading ? (
        // Estado: cargando.
        <p className="text-center text-gray-500">Cargando favoritos…</p>
      ) : error ? (
        // Estado: error (incluye 401 si la sesión expiró). Mostramos mensaje visible.
        <ErrorMessage message={error.message} title="No se pudieron cargar los favoritos" />
      ) : !favorites || favorites.length === 0 ? (
        // Estado: lista vacía.
        <p className="text-center text-gray-500">No tienes productos en favoritos.</p>
      ) : (
        // Estado: hay datos. Grilla de tarjetas de los productos favoritos.
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recorremos los favoritos */}
          {favorites.map((fav) => (
            // Cada favorito contiene su producto anidado; si existe, lo mostramos.
            // Marcamos isFavorited=true (ya está en favoritos) y al quitarlo se refresca la lista.
            fav.product ? (
              <ProductCard
                key={fav.id}
                product={fav.product}
                isFavorited={true}
                onFavoritesChange={handleFavoritesChange}
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
