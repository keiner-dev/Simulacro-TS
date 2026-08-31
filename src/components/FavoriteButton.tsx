// Importamos el hook useAuth para saber si hay usuario autenticado.
import { useAuth } from "@/context/auth-context";
// Importamos el servicio de favoritos (agregar/quitar).
import * as favoriteService from "@/services/favoriteService";

// Interface con las props:
// - productId: id del producto al que pertenece el botón.
// - isFavorited: si el producto ya está en favoritos (lo decide el padre).
// - onChange (opcional): callback para que el padre refresque su estado sin recargar.
interface FavoriteButtonProps {
  // productId: el id del producto.
  productId: string;
  // isFavorited: indica si el producto está guardado como favorito.
  isFavorited: boolean;
  // onChange: función opcional que se llama tras agregar/quitar, para actualizar listas.
  onChange?: () => void;
}

// Componente que muestra un botón de favorito visible SOLO para usuarios autenticados.
// Su estado (corazón lleno/vacío) refleja si el producto está guardado.
export default function FavoriteButton({ productId, isFavorited, onChange }: FavoriteButtonProps) {
  // Obtenemos el usuario del contexto (para saber si está autenticado).
  const { user } = useAuth();

  // Si NO hay usuario autenticado, no renderizamos nada (el botón es solo para autenticados).
  if (!user) return null;

  // Función que alterna favorito (agrega si no está, quita si está).
  const toggleFavorite = async () => {
    try {
      // Si el producto ya está en favoritos, lo quitamos (DELETE /favorites/:productId).
      if (isFavorited) {
        // Llamamos al servicio para quitar el favorito.
        await favoriteService.removeFavorite(productId);
      } else {
        // Si NO está, lo agregamos (POST /favorites/:productId).
        await favoriteService.addFavorite(productId);
      }
      // Manejo de "409" (ya estaba) y "404" (no estaba): Si el servidor devuelve alguno,
      // la capa request lo convierte en ApiError con kind "conflict"/"notFound", y como
      // no lo capturamos aquí con un throw, simplemente no se rompe la interfaz; el estado
      // queda como estaba y el usuario ve su botón. Para no dejar bloqueado, forzamos el
      // onChange para re-sincronizar con el estado real del servidor.
      if (onChange) onChange();
    } catch {
      // Si ocurre un error de red u otro, mostramos un aviso amigable sin romper la UI.
      alert("No se pudo actualizar el favorito. Intenta de nuevo.");
    }
  };

  // Renderizamos el botón con estilo según el estado de favorito.
  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        // Si está en favoritos: fondo rojo, texto blanco. Si no: borde, texto gris.
        isFavorited
          ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
          : "border-gray-300 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {/* Mostramos un corazón: lleno (♥) si está en favoritos, vacío (♡) si no */}
      {isFavorited ? "♥ Quitar" : "♡ Favorito"}
    </button>
  );
}
