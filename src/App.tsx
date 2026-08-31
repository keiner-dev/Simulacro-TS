// Importamos React Router para definir las rutas de la aplicación.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Importamos el proveedor de autenticación.
import { AuthProvider } from "@/context/AuthContext";
// Importamos el ErrorBoundary (Módulo 6: captura errores de renderizado).
import ErrorBoundary from "@/components/ErrorBoundary";
// Importamos el Layout (barra de navegación + contenido).
import Layout from "@/components/Layout";
// Importamos el componente que protege rutas por autenticación y por rol.
import ProtectedRoute from "@/components/ProtectedRoute";
// Importamos las páginas.
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductNewPage from "@/pages/ProductNewPage";
import ProductEditPage from "@/pages/ProductEditPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryDetailPage from "@/pages/CategoryDetailPage";
import CategoryNewPage from "@/pages/CategoryNewPage";
import FavoritesPage from "@/pages/FavoritesPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Componente raíz de la aplicación: define el proveedor de auth, el error boundary
// y todas las rutas (públicas, protegidas por autenticación y por rol).
export default function App() {
  return (
    // ErrorBoundary envuelve toda la app: si una página lanza un error de renderizado,
    // muestra un fallback amigable en lugar de una pantalla en blanco.
    <ErrorBoundary>
      {/* BrowserRouter habilita el enrutado por URL del navegador */}
      <BrowserRouter>
        {/* AuthProvider expone el usuario/rol/sesión a toda la app */}
        <AuthProvider>
          {/* Definición de rutas; el Layout engloba todas las páginas con su navbar */}
          <Routes>
            {/* El Layout envuelve todas las rutas (usa Outlet para renderizar cada página) */}
            <Route element={<Layout />}>
              {/* RUTAS PÚBLICAS */}
              {/* Página de inicio: listado de productos (público) */}
              <Route path="/" element={<ProductsPage />} />
              {/* Detalle de un producto (público) */}
              <Route path="/productos/:id" element={<ProductDetailPage />} />
              {/* Listado de categorías (público) */}
              <Route path="/categorias" element={<CategoriesPage />} />
              {/* Detalle de una categoría (público, con botón agregar producto para autenticados) */}
              <Route path="/categorias/:id" element={<CategoryDetailPage />} />
              {/* Página de login (pública) */}
              <Route path="/login" element={<LoginPage />} />
              {/* Página de registro (pública) */}
              <Route path="/registro" element={<RegisterPage />} />

              {/* RUTAS PROTEGIDAS POR AUTENTICACIÓN (requieren sesión iniciada) */}
              {/* "Mis favoritos": solo para usuarios autenticados */}
              <Route element={<ProtectedRoute requireAuth />}>
                <Route path="/favoritos" element={<FavoritesPage />} />
                {/* Crear producto: requiere autenticación (cualquier rol) */}
                <Route path="/productos/nuevo" element={<ProductNewPage />} />
                {/* Editar producto: requiere autenticación */}
                <Route path="/productos/:id/editar" element={<ProductEditPage />} />
              </Route>

              {/* RUTAS PROTEGIDAS POR ROL (RBAC): solo admin */}
              {/* Crear categoría: si un usuario "user" entra por URL directa, es redirigido */}
              <Route element={<ProtectedRoute requireAuth allowedRoles={["admin"]} />}>
                <Route path="/categorias/nueva" element={<CategoryNewPage />} />
              </Route>

              {/* Ruta por defecto: cualquier URL no definida redirige al home */}
              <Route path="*" element={<ProductsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
