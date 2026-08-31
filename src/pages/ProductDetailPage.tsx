// Importamos hooks de React Router para leer el id de la URL, enlazar y navegar.
import { useParams, Link, useNavigate } from "react-router-dom";
// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos el servicio de producto (para eliminar).
import { deleteProduct } from "@/services/productService";
// Importamos componentes de UI.
import ErrorMessage from "@/components/ErrorMessage";
import FavoriteButton from "@/components/FavoriteButton";
// Importamos el contexto de auth (para mostrar botones de editar/eliminar).
import { useAuth } from "@/context/auth-context";
// Importamos tipos.
import type { Product } from "@/types/product";
// Importamos la utilidad de formato.
import { formatPrice } from "@/utils/format";

// Componente de la página de detalle de un producto.
export default function ProductDetailPage() {
  // Leemos el id del producto desde la URL (/productos/:id).
  const { id } = useParams<{ id: string }>();
  // useAuth para saber si está autenticado (permite editar/eliminar).
  const { user } = useAuth();
  // useNavigate para redirigir tras eliminar.
  const navigate = useNavigate();

  // useFetch para obtener el detalle del producto. La URL depende de "id".
  // Si "id" es undefined, no pedimos nada (avoid petición inválida).
  const { data: product, loading, error, refetch } = useFetch<Product>(id ? `/products/${id}` : "");

  // Función que maneja la eliminación del producto.
  const handleDelete = async () => {
    // Confirmamos con el usuario antes de borrar.
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      // Si hay id, llamamos al servicio de eliminación.
      if (id) await deleteProduct(id);
      // Tras eliminar, redirigimos al listado de productos.
      navigate("/");
    } catch {
      // Si falla la eliminación, mostramos un aviso (no rompe la UI).
      alert("No se pudo eliminar el producto.");
    }
  };

  // Renderizamos la página.
  return (
    <div>
      {/* Enlace para volver a la lista */}
      <Link to="/" className="text-blue-600 hover:underline">
        ← Volver
      </Link>

      {/* Renderizado condicional: cargando / error / datos */}
      {loading ? (
        // Estado: cargando.
        <p className="mt-6 text-center text-gray-500">Cargando producto…</p>
      ) : error ? (
        // Estado: error (incluye 404 si no existe).
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudo cargar el producto" />
        </div>
      ) : product ? (
        // Estado: hay datos del producto.
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {/* Columna de imagen */}
          <div className="flex h-80 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {/* Si hay una imagen, la mostramos con manejo de error de carga */}
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
                // onError: si la URL falla, ocultamos la img (no rompe el layout).
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              // Si no hay imagen, placeholder.
              <span className="text-gray-400">Sin imagen</span>
            )}
          </div>

          {/* Columna de información */}
          <div>
            {/* Nombre del producto */}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {/* Categoría (si existe) */}
            {product.category?.name && <p className="text-sm text-gray-500">{product.category.name}</p>}
            {/* Precio formateado */}
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
            {/* Stock */}
            <p className={`mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
            </p>
            {/* Descripción (si existe) */}
            {product.description && <p className="mt-4 text-gray-700">{product.description}</p>}

            {/* Botón de favorito (solo autenticados) */}
            <div className="mt-6">
              <FavoriteButton productId={product.id} isFavorited={false} onChange={refetch} />
            </div>

            {/* Acciones de edición/eliminación: SOLO para usuarios autenticados */}
            {user && (
              <div className="mt-6 flex gap-3">
                {/* Botón editar: navega al formulario de edición */}
                <Link
                  to={`/productos/${product.id}/editar`}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Editar
                </Link>
                {/* Botón eliminar */}
                <button
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
