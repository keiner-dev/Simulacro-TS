// Importamos hooks de React.
import { useState, useEffect } from "react";
// Importamos el hook genérico useFetch para datos.
import { useFetch } from "@/hooks/useFetch";
// Importamos el servicio de favoritos (para saber cuáles están marcados).
import { getFavorites } from "@/services/favoriteService";
// Importamos los componentes de UI.
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import ErrorMessage from "@/components/ErrorMessage";
// Importamos tipos.
import type { PaginatedResponse, Product } from "@/types/product";
import type { Category } from "@/types/category";
// Importamos el contexto de auth (para saber si mostrar el botón de favoritos).
import { useAuth } from "@/context/auth-context";

// Componente de la página de inicio: listado de productos con paginación,
// búsqueda y filtro por categoría.
export default function ProductsPage() {
  // Estado del texto de búsqueda actual (se envía a la API).
  const [search, setSearch] = useState("");
  // Estado del filtro de categoría seleccionado ("" = todas).
  const [categoryId, setCategoryId] = useState("");
  // Estado de la página actual.
  const [page, setPage] = useState(1);
  // Estado con los ids de los productos que están en favoritos (para el corazón lleno).
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  // Construimos la URL de productos con los query params actuales. Al cambiar search,
  // categoryId o page, la URL cambia y useFetch vuelve a pedir datos (dependencia).
  const url = `/products?${buildQuery({ search, categoryId, page, limit: 9 })}`;

  // useFetch para los productos paginados (se dispara cuando cambia la URL).
  const { data: pageData, loading, error, refetch } = useFetch<PaginatedResponse<Product>>(url);
  // useFetch para las categorías (lista para el filtro).
  const { data: categories } = useFetch<Category[]>("/categories");
  // useAuth para saber si hay usuario autenticado (afecta favoritos).
  const { user } = useAuth();

  // Efecto: cuando hay usuario autenticado, cargamos sus favoritos una vez
  // (para marcar los corazones llenos). Depende de user.
  useEffect(() => {
    // Solo si hay usuario cargamos los favoritos.
    if (user) {
      // Definimos función asíncrona.
      (async () => {
        try {
          // Pedimos los favoritos del usuario actual.
          const favs = await getFavorites();
          // Guardamos SOLO los ids de producto de los favoritos.
          setFavoriteIds(favs.map((f) => f.productId));
        } catch {
          // Si falla, dejamos la lista vacía (no rompe la página).
          setFavoriteIds([]);
        }
      })();
    }
    // Nota: cuando no hay usuario no reseteamos favoritos sincrónicamente aquí para
    // evitar setState directo en el efecto. Los botones de favorito están ocultos
    // cuando no hay sesión, y al volver a iniciar sesión este efecto vuelve a cargarlos.
  }, [user]);

  // Función que se llama al buscar: resetea la página a 1 y aplica el término.
  const handleSearch = (term: string) => {
    // Seteamos la búsqueda (esto cambia la URL y refresca los datos).
    setSearch(term);
    // Volvemos a la primera página.
    setPage(1);
  };

  // Función que se llama al cambiar el filtro de categoría.
  const handleCategoryChange = (value: string) => {
    // Seteamos la categoría seleccionada.
    setCategoryId(value);
    // Volvemos a la primera página.
    setPage(1);
  };

  // Función que se llama al cambiar de página.
  const handlePageChange = (p: number) => {
    // Seteamos la página nueva.
    setPage(p);
  };

  // Función que se llama cuando cambia un favorito: recargamos productos y favoritos.
  const handleFavoritesChange = () => {
    // Recargamos los favoritos del usuario para actualizar los corazones.
    if (user) {
      // Función asíncrona para recargar favoritos.
      (async () => {
        try {
          // Pedimos los favoritos nuevamente.
          const favs = await getFavorites();
          // Actualizamos los ids de favorito.
          setFavoriteIds(favs.map((f) => f.productId));
        } catch {
          // Si falla, no hacemos nada (no rompe la UI).
        }
      })();
    }
    // También recargamos los productos (por si cambió algo).
    refetch();
  };

  // Renderizamos la página.
  return (
    <div>
      {/* Encabezado */}
      <h1 className="mb-4 text-2xl font-bold">Productos</h1>

      {/* Barra de búsqueda (formulario controlado) */}
      <div className="mb-4 max-w-xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Select de filtro por categoría */}
      <div className="mb-6 max-w-xs">
        <label className="mb-1 block text-sm font-medium">Filtrar por categoría</label>
        <select
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          {/* Opción "todas las categorías" */}
          <option value="">Todas</option>
          {/* Opciones por cada categoría */}
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Renderizado condicional de estados: cargando, error, lista vacía, lista con datos */}
      {loading ? (
        // Estado: cargando.
        <p className="text-center text-gray-500">Cargando productos…</p>
      ) : error ? (
        // Estado: error. Mostramos mensaje visible (no pantalla en blanco).
        <ErrorMessage message={error.message} title="No se pudieron cargar los productos" />
      ) : !pageData || pageData.data.length === 0 ? (
        // Estado: lista vacía.
        <p className="text-center text-gray-500">
          {search || categoryId ? "No se encontraron productos con esos filtros." : "No hay productos."}
        </p>
      ) : (
        // Estado: hay datos. Renderizamos la grilla de productos.
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Recorremos los productos de la página actual */}
            {pageData.data.map((product: Product) => (
              // Para cada producto renderizamos su tarjeta.
              <ProductCard
                key={product.id}
                product={product}
                // Le decimos si está en favoritos según favoriteIds (corazón lleno/vacío).
                isFavorited={favoriteIds.includes(product.id)}
                onFavoritesChange={handleFavoritesChange}
              />
            ))}
          </div>
          {/* Controles de paginación */}
          <Pagination page={pageData.page} totalPages={pageData.totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}

// Función auxiliar (pura) que construye el query string a partir de los parámetros.
function buildQuery(params: { search: string; categoryId: string; page: number; limit: number }): string {
  // Creamos un objeto URLSearchParams para codificar.
  const qp = new URLSearchParams();
  // Agregamos search solo si hay texto.
  if (params.search) qp.set("search", params.search);
  // Agregamos categoryId solo si hay una categoría.
  if (params.categoryId) qp.set("categoryId", params.categoryId);
  // Agregamos la página.
  qp.set("page", String(params.page));
  // Agregamos el límite.
  qp.set("limit", String(params.limit));
  // Devolvemos el query string codificado.
  return qp.toString();
}
