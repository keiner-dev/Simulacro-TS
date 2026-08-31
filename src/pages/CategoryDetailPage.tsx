// Importamos hooks de React Router para leer el id, enlazar.
import { useParams, Link } from "react-router-dom";
// Importamos React hooks.
import { useState } from "react";
// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos servicios.
import { createProduct } from "@/services/productService";
// Importamos componentes.
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import ErrorMessage from "@/components/ErrorMessage";
// Importamos el contexto de auth.
import { useAuth } from "@/context/auth-context";
// Importamos tipos.
import type { Category } from "@/types/category";
import type { PaginatedResponse, Product, ProductPayload } from "@/types/product";

// Componente de la página de detalle de una categoría, mostrando sus productos.
export default function CategoryDetailPage() {
  // Leemos el id de la categoría desde la URL (/categorias/:id).
  const { id } = useParams<{ id: string }>();
  // useAuth para saber si hay usuario (muestra el botón "agregar producto").
  const { user } = useAuth();

  // useFetch para obtener la categoría actual.
  const { data: category, loading: catLoading, error: catError } = useFetch<Category>(
    id ? `/categories/${id}` : ""
  );
  // useFetch para obtener los productos de esta categoría (filtrados por categoryId).
  const { data: productsPage, loading: prodLoading, error: prodError, refetch } = useFetch<PaginatedResponse<Product>>(
    id ? `/products?categoryId=${id}` : ""
  );
  // useFetch para obtener todas las categorías (necesario para el select del formulario).
  const { data: categories } = useFetch<Category[]>("/categories");

  // Estado para alternar la visibilidad del formulario "agregar producto".
  const [showForm, setShowForm] = useState(false);

  // Función onSubmit del formulario reutilizable (creación, con la categoría ya preseleccionada).
  const handleCreateProduct = async (data: ProductPayload) => {
    // Llamamos al servicio de creación con los datos del formulario.
    await createProduct(data);
    // Ocultamos el formulario tras crear.
    setShowForm(false);
    // Recargamos los productos de la categoría.
    refetch();
  };

  // Renderizamos la página.
  return (
    <div>
      {/* Enlace para volver al listado de categorías */}
      <Link to="/categorias" className="text-blue-600 hover:underline">
        ← Volver a categorías
      </Link>

      {/* Estado de carga de la categoría */}
      {catLoading ? (
        <p className="mt-6 text-center text-gray-500">Cargando categoría…</p>
      ) : catError ? (
        // Error al cargar la categoría.
        <div className="mt-6">
          <ErrorMessage message={catError.message} title="No se pudo cargar la categoría" />
        </div>
      ) : category ? (
        // Hay categoría: mostramos su nombre y descripción.
        <>
          <h1 className="mt-4 text-2xl font-bold">{category.name}</h1>
          {category.description && <p className="text-gray-600">{category.description}</p>}

          {/* Botón "Agregar producto a esta categoría": visible SOLO para usuarios autenticados */}
          {user && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="mt-4 rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
            >
              {showForm ? "Cancelar" : "Agregar producto a esta categoría"}
            </button>
          )}
        </>
      ) : null}

      {/* Formulario de crear producto (se muestra si showForm es true y hay categoría) */}
      {showForm && category && (
        <div className="mt-6">
          {/* Pasamos presetCategoryId = category.id: el select queda fijo en esta categoría.
            Este es el MISMO formulario que se usa en crear-producto general. */}
          <ProductForm
            categories={categories ?? []}
            presetCategoryId={category.id}
            onSubmit={handleCreateProduct}
          />
        </div>
      )}

      {/* Sección de productos de la categoría */}
      <h2 className="mt-8 mb-4 text-xl font-bold">Productos de esta categoría</h2>

      {/* Renderizado condicional de los productos */}
      {prodLoading ? (
        <p className="text-center text-gray-500">Cargando productos…</p>
      ) : prodError ? (
        <ErrorMessage message={prodError.message} title="No se pudieron cargar los productos" />
      ) : !productsPage || productsPage.data.length === 0 ? (
        <p className="text-center text-gray-500">Esta categoría no tiene productos aún.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recorremos los productos de la categoría */}
          {productsPage.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
