// Importamos hooks de React Router para navegar y enlazar.
import { useNavigate, Link } from "react-router-dom";
// Importamos el hook genérico useFetch.
import { useFetch } from "@/hooks/useFetch";
// Importamos los servicios.
import { createProduct } from "@/services/productService";
// Importamos el formulario reutilizable de producto.
import ProductForm from "@/components/ProductForm";
// Importamos ErrorMessage para errores de carga de categorías.
import ErrorMessage from "@/components/ErrorMessage";
// Importamos tipos.
import type { ProductPayload } from "@/types/product";
import type { Category } from "@/types/category";

// Componente de la página para CREAR un producto desde la zona general de productos.
// En esta entrada SÍ se muestra el <select> con todas las categorías (sin preset).
export default function ProductNewPage() {
  // useNavigate para redirigir tras crear.
  const navigate = useNavigate();
  // useFetch para cargar todas las categorías (para el select del formulario).
  const { data: categories, loading, error } = useFetch<Category[]>("/categories");

  // Función onSubmit que el formulario reutilizable llama con los datos.
  const handleSubmit = async (data: ProductPayload) => {
    // Llamamos al servicio de creación (isEdit=false, sin id).
    await createProduct(data);
    // Tras crear, redirigimos al listado de productos.
    navigate("/");
  };

  // Renderizamos la página.
  return (
    <div className="mx-auto max-w-lg">
      {/* Enlace para volver */}
      <Link to="/" className="text-blue-600 hover:underline">
        ← Volver
      </Link>

      {/* Mientras cargan las categorías */}
      {loading ? (
        <p className="mt-6 text-center text-gray-500">Cargando formulario…</p>
      ) : error ? (
        // Si fallan las categorías mostramos error (no pantalla en blanco).
        <div className="mt-6">
          <ErrorMessage message={error.message} title="No se pudieron cargar las categorías" />
        </div>
      ) : (
        // Renderizamos el formulario REUTILIZABLE sin categoría preseleccionada
        // (el usuario elige la categoría del select).
        <div className="mt-6">
          <ProductForm categories={categories ?? []} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
