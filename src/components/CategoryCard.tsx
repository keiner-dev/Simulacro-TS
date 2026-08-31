// Importamos React Router para enlazar al detalle de la categoría.
import { Link } from "react-router-dom";
// Importamos el tipo Category.
import type { Category } from "@/types/category";

// Interface con las props: la categoría a mostrar.
interface CategoryCardProps {
  // category: la categoría que se renderiza.
  category: Category;
}

// Componente que renderiza una tarjeta de categoría (se usa en el listado de categorías).
export default function CategoryCard({ category }: CategoryCardProps) {
  // Renderizamos la tarjeta como un enlace que navega al detalle de la categoría.
  return (
    <Link
      to={`/categorias/${category.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Nombre de la categoría */}
      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
      {/* Descripción (si existe) */}
      {category.description && <p className="mt-1 text-sm text-gray-600">{category.description}</p>}
    </Link>
  );
}
