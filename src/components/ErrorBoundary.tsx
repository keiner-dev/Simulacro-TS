// Importamos los tipos necesarios de React para un Error Boundary (clase).
import { Component, type ReactNode } from "react";

// Interface con las props del ErrorBoundary: children (lo que envuelve).
interface ErrorBoundaryProps {
  // children: el contenido protegido por el boundary.
  children: ReactNode;
}

// Interface con el estado del ErrorBoundary.
interface ErrorBoundaryState {
  // hasError: true si se capturó un error de renderizado.
  hasError: boolean;
  // message: el mensaje del error capturado (para mostrarlo).
  message: string;
}

// ErrorBoundary: un componente de CLASE que captura errores de renderizado de sus hijos.
// UNA SOLA regla: JavaScript solo permite capturar errores de render con métodos
// de ciclo de vida de clase (getDerivedStateFromError y componentDidCatch), por eso
// no se puede hacer con un componente funcional. Por esto el uso de clase SÍ está justificado.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Definimos el estado inicial: no hay error.
  constructor(props: ErrorBoundaryProps) {
    // Llamamos al constructor de la clase padre Component.
    super(props);
    // Inicializamos el estado sin error.
    this.state = { hasError: false, message: "" };
  }

  // Método estático del ciclo de vida: se llama cuando un hijo lanza un error durante
  // el renderizado. Debe devolver un nuevo estado. Es el que "activa" el fallback.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Devolvemos el nuevo estado: hasError true y el mensaje del error capturado.
    return { hasError: true, message: error.message };
  }

  // Método del ciclo de vida: se ejecuta después de capturar el error. Lo usamos
  // para loguear el error en consola (útil para depuración).
  componentDidCatch(error: Error) {
    // Imprimimos el error en la consola del navegador.
    console.error("Error capturado por ErrorBoundary:", error);
  }

  // Función para recargar la página (botón "Recargar").
  handleReload = () => {
    // Recargamos la página completa para reiniciar la app.
    window.location.reload();
  };

  // Método render: define qué se muestra.
  render() {
    // Si hay un error capturado (hasError true):
    if (this.state.hasError) {
      // Mostramos un fallback amigable con el mensaje y un botón de recargar.
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow">
            {/* Título del error */}
            <h1 className="mb-2 text-xl font-bold text-red-600">Algo salió mal</h1>
            {/* Mensaje del error capturado */}
            <p className="mb-4 text-gray-600">
              Ha ocurrido un error inesperado en la interfaz. Tu sesión y tus datos están a salvo.
            </p>
            {/* Mostramos el mensaje técnico del error */}
            <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">{this.state.message}</p>
            {/* Botón para recargar la aplicación */}
            <button
              onClick={this.handleReload}
              className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    // Si no hay error, renderizamos los hijos con normalidad.
    return this.props.children;
  }
}
