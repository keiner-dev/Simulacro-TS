// Componente funcional simple para mostrar un mensaje de error visible al usuario.
// Es el estándar para traducir errores (red/validación/autorización) en feedback de UI.
// Props:
// - message: el texto del error a mostrar.
// - title (opcional): un título corto para el error (ej. "Error de red").
export default function ErrorMessage({ message, title = "Error" }: { message: string; title?: string }) {
  // Renderizamos un bloque con estilo de error.
  return (
    <div role="alert" className="mb-4 rounded border border-red-300 bg-red-50 p-4 text-red-800">
      {/* Título del error */}
      <p className="font-semibold">{title}</p>
      {/* Mensaje de error */}
      <p className="text-sm">{message}</p>
    </div>
  );
}
