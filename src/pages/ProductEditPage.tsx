// Importamos hooks de React Router para leer el id, navegar y enlazar.
import { useParams, useNavigate, Link } from "react-router-dom";
// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos los servicios.
import { updateProduct } from "@/services/productService";
// Importamos el formulario reutilizable.
import ProductForm from "@/components/ProductForm";
// Importamos ErrorMessage.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos tipos.
import type { Product, ProductPayload } from "@/types/product";
import type { Category } from "@/types/category";

// Componente de la página para EDITAR un producto (modo edición del formulario reutilizable).
export default function ProductEditPage() {
  // Leemos el id del producto desde la URL (/productos/:id/editar).
  const { id } = useParams<{ id: string }>();
  // useNavigate para redirigir tras guardar.
  const navigate = useNavigate();
  // useFetch para cargar el producto a editar (depende de id).
  const { data: product, loading, error } = useFetch<Product>(id ? `/products/${id}` : "");
  // useFetch para cargar las categorías (necesarias para el select).
  const { data: categories, loading: catLoading, error: catError } = useFetch<Category[]>("/categories");

  // Función onSubmit que llama el formulario reutilizable.
  const handleSubmit = async (data: ProductPayload, isEdit: boolean, productId?: string) => {
    // Si es modo edición y hay id, llamamos al servicio de actualización.
    if (isEdit && productId) {
      await updateProduct(productId, data);
    }
    // Tras guardar, redirigimos al detalle del producto editado.
    navigate(`/productos/${productId}`);
  };

  // Renderizamos la página.
  return (
    <div className="mx-auto max-w-lg">
      {/* Enlace para volver (al detalle del producto) */}
      {id && (
        <Link to={`/productos/${id}`} className="text-blue-600 hover:underline">
          ← Volver al producto
        </Link>
      )}

      {/* Mientras cargan producto o categorías */}
      {loading || catLoading ? (
        <p className="mt-6 text-center text-gray-500">Cargando…</p>
      ) : error ? (
        // Error al cargar el producto (ej. 404).
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudo cargar el producto" />
        </div>
      ) : catError ? (
        // Error al cargar categorías.
        <div className="mt-6">
          <ErrorMessage message={catError.message} title="No se pudieron cargar las categorías" />
        </div>
      ) : product ? (
        // Hay producto: renderizamos el formulario reutilizable en modo edición
        // pasándole el initialProduct para precargar los campos.
        <div className="mt-6">
          <ProductForm
            categories={categories ?? []}
            initialProduct={product}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}
    </div>
  );
}
