// PRUEBA DE INTEGRACIÓN con React Testing Library (Módulo 7).
// Simula una interacción real: completar y enviar el formulario de login.

// Importamos las utilidades de testing de React.
import { render, screen, waitFor } from "@testing-library/react";
// userEvent simula interacciones del usuario (escribir, hacer clic).
import userEvent from "@testing-library/user-event";
// MemoryRouter para envolver la página con React Router.
import { MemoryRouter } from "react-router-dom";
// AuthProvider para darle contexto de autenticación a la página.
import { AuthProvider } from "@/context/AuthContext";
// La página de login que vamos a probar.
import LoginPage from "@/pages/LoginPage";
// El servicio de autenticación que vamos a mockear (es el que hace la petición a la API).
import * as authService from "@/services/authService";

// Configuramos un mock de la función login del servicio (no queremos la red real).
// Solo simulamos la llamada a la API, no toda la aplicación.
vi.mock("@/services/authService", async (importOriginal) => {
  // Traemos el módulo original (para conservar otras exportaciones).
  const actual = await importOriginal<typeof import("@/services/authService")>();
  // Devolvemos el módulo pero con login y logout mockeados.
  return {
    ...actual,
    login: vi.fn(), // reemplazamos login con una función mock.
    logout: vi.fn(), // reemplazamos logout con una función mock.
  };
});

// Función auxiliar que renderiza la página de login con los providers necesarios.
function renderLogin() {
  return render(
    // MemoryRouter simula un navegador con rutas en memoria.
    <MemoryRouter initialEntries={["/login"]}>
      {/* AuthProvider para que useAuth funcione dentro de LoginPage */}
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Formulario de login", () => {
  // La única prueba de integración: completar el formulario y enviarlo.
  it("completa el formulario, envía y llama al servicio login con las credenciales", async () => {
    // Preparamos un usuario fake para la respuesta del login.
    const fakeResponse = {
      accessToken: "token-falso",
      user: { id: "1", name: "Ana", email: "ana@example.com", role: "user", createdAt: "2026-01-01" },
    };
    // Hacemos que el login mockeado resuelva con la respuesta fake.
    (authService.login as ReturnType<typeof vi.fn>).mockResolvedValue(fakeResponse);

    // Renderizamos la página de login.
    renderLogin();

    // Simulamos que el usuario escribe su email en el input de email.
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    // Simulamos que el usuario escribe su contraseña.
    await userEvent.type(screen.getByLabelText("Contraseña"), "MiPass123");

    // Simulamos el clic en el botón de "Iniciar sesión".
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Esperamos (waitFor) y verificamos que el servicio login fue llamado con las credenciales.
    await waitFor(() => {
      // Comprobamos que login se llamó una vez con el email y password escritos.
      expect(authService.login).toHaveBeenCalledWith({ email: "ana@example.com", password: "MiPass123" });
    });
  });
});
