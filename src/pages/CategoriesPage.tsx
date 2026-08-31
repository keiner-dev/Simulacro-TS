// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos la tarjeta de categoría.
import CategoryCard from "@/components/CategoryCard";
// Importamos ErrorMessage.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos tipos.
import type { Category } from "@/types/category";

// Componente de la página de listado de categorías (público, sin login necesario).
export default function CategoriesPage() {
  // useFetch para obtener todas las categorías (endpoint público).
  const { data: categories, loading, error } = useFetch<Category[]>("/categories");

  // Renderizamos la página.
  return (
    <div>
      {/* Título */}
      <h1 className="mb-4 text-2xl font-bold">Categorías</h1>

      {/* Renderizado condicional: cargando / error / vacío / datos */}
      {loading ? (
        // Estado: cargando.
        <p className="text-center text-gray-500">Cargando categorías…</p>
      ) : error ? (
        // Estado: error.
        <ErrorMessage message={error.message} title="No se pudieron cargar las categorías" />
      ) : !categories || categories.length === 0 ? (
        // Estado: lista vacía.
        <p className="text-center text-gray-500">No hay categorías.</p>
      ) : (
        // Estado: hay datos. Renderizamos la grilla de categorías.
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recorremos las categorías y mostramos cada tarjeta */}
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
