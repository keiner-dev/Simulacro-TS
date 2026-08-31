// Archivo de configuración de pruebas (se ejecuta antes de cada test).
// Importamos "@testing-library/jest-dom" para tener matchers adicionales de DOM,
// como toBeInTheDocument(), toHaveTextContent(), etc. Sin esto React Testing Library
// no reconoce esos matchers y los tests fallarían.
import "@testing-library/jest-dom";

// Aseguramos que localStorage exista en el entorno de pruebas. En algunos entornos
// jsdom de Vitest, localStorage puede no estar disponible y causar errores al
// importar AuthenticationContext (que usa tokenStorage con localStorage).
// Por eso creamos un mock simple con getItem/setItem/removeItem/clear.
if (typeof localStorage === "undefined") {
  // Creamos un objeto que simula localStorage con un almacén en memoria.
  const store = new Map<string, string>();
  // Lo asignamos a la variable global localStorage como objeto con sus métodos.
  (globalThis as Record<string, unknown>).localStorage = {
    // getItem: devuelve el valor guardado o null.
    getItem: (key: string) => store.get(key) ?? null,
    // setItem: guarda un valor bajo una clave.
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    // removeItem: elimina una clave.
    removeItem: (key: string) => {
      store.delete(key);
    },
    // clear: vacía todo el almacén.
    clear: () => store.clear(),
  };
}
