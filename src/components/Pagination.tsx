// Componente de paginación: muestra botones para navegar entre páginas.
// Props:
// - page: página actual (1-indexado).
// - totalPages: total de páginas disponible.
// - onPageChange: función que se llama con la nueva página al hacer clic.
interface PaginationProps {
  // page: la página actual.
  page: number;
  // totalPages: el total de páginas del listado.
  totalPages: number;
  // onPageChange: callback que recibe el nuevo número de página.
  onPageChange: (page: number) => void;
}

// Componente de paginación reutilizable para listados paginados.
export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  // Si solo hay una página (o ninguna), no mostramos la paginación.
  if (totalPages <= 1) return null;

  // Renderizamos la barra de paginación.
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {/* Botón "Anterior": deshabilitado si estamos en la primera página */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
      >
        Anterior
      </button>

      {/* Mostramos el texto "Página X de Y" */}
      <span className="px-2 text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>

      {/* Botón "Siguiente": deshabilitado si estamos en la última página */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}
