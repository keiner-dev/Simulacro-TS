# Frontend — Gestión de Productos

Aplicación frontend construida con **React + TypeScript (Vite)** que consume la API REST de gestión de productos (NestJS + PostgreSQL con autenticación JWT).

## Stack

- **React 19 + TypeScript** (Vite 8)
- **React Router DOM 7** (enrutado)
- **Axios** (peticiones HTTP)
- **Tailwind CSS 4** (estilos)
- **Vitest + React Testing Library** (pruebas)

## Cómo correr el proyecto

1. Clona el repositorio e instala dependencias:

   ```bash
   npm install
   ```

2. Crea el archivo `.env` con la URL de la API (por defecto ya apunta a `http://localhost:3000`):

   ```
   VITE_API_URL=http://localhost:3000
   ```

3. Levanta el servidor (asegúrate de tener el backend corriendo):

   ```bash
   npm run dev
   ```

4. Abre `http://localhost:5173` en el navegador.

### Scripts disponibles

| Comando           | Descripción                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Levanta el servidor de desarrollo (Vite).  |
| `npm run build`   | Compila TypeScript y genera el build.      |
| `npm run lint`    | Ejecuta ESLint.                            |
| `npm run test`    | Ejecuta las pruebas una sola vez.          |
| `npm run preview` | Previsualiza el build de producción.       |

## Estructura de carpetas

```
src/
├── types/        # Tipos del dominio (Product, Category, User, Auth, Favoritos, Paginación)
├── lib/          # Capa de infraestructura: axios (api + request<T>), errors (ApiError), tokenStorage
├── hooks/        # Hooks reutilizables (useFetch<T>)
├── services/     # Servicios de API (auth, product, category, favorite)
├── context/      # Estado global (AuthContext)
├── components/   # Componentes de UI reutilizables
├── pages/        # Páginas / vistas
├── utils/        # Funciones puras (formatPrice, etc.)
└── test/         # Configuración de pruebas (setup)
```

## Dónde se guarda el token de sesión y por qué

El `accessToken` se guarda en **`localStorage`** (no en `sessionStorage`).

**Justificación:** la prueba ("persistencia de sesión") requiere que, al recargar la página o reabrir el navegador, la sesión se mantenga mientras el token siga vigente. `localStorage` persiste entre sesiones del navegador, mientras que `sessionStorage` se borra al cerrar la pestaña/navegador. Como el token JWT ya tiene su propia fecha de expiración (lo valida el servidor con un 401), tenerlo en `localStorage` es seguro: si expira, el interceptor de Axios limpia el token y redirige al login.

El acceso se encapsula en `src/lib/tokenStorage.ts` (métodos `get`, `set`, `remove`), de modo que si mañana se decidiera usar `sessionStorage`, solo habría que cambiar ese archivo.

## Librería HTTP y resolución de interceptores

Se eligió **Axios** porque ofrece **interceptores** de request/response de forma nativa, lo que simplifica dos requisitos:

1. **Inyección del token:** un interceptor de *request* lee el token de `localStorage` y agrega automáticamente el header `Authorization: Bearer <token>` en todas las peticiones a rutas protegidas.
2. **Reacción a 401:** un interceptor de *response* detecta cuando la API responde `401` (token inválido/expirado), limpia el token del storage y redirige al login.

Esto se implementa en `src/lib/api.ts`. Sobre la instancia se construye una **capa tipada genérica** `request<T>(method, url, data?)` que centraliza el manejo de errores: convierte cualquier error en una clase `ApiError` (`src/lib/errors.ts`) con una propiedad `kind` que distingue error de **red** (backend caído), **validación** (400/422), **no autorizado** (401), **prohibido** (403), **no encontrado** (404) y **conflicto** (409). Así el UI muestra mensajes claros y nunca una pantalla en blanco.

## Enrutamiento protegido (RBAC)

`src/components/ProtectedRoute.tsx` protege las rutas en dos niveles:

- **Autenticación** (`requireAuth`): redirige al login si no hay usuario.
- **Autorización por rol** (`allowedRoles`): redirige al home si el rol no coincide.

Por ejemplo, crear categorías (`/categorias/nueva`) solo admite `role: "admin"`; un usuario `user` que escriba la URL directa es redirigido, no solo se le oculta el botón.

## Pruebas

- `src/utils/format.test.ts`: **prueba unitaria** de funciones puras (formato de precio e imágenes).
- `src/pages/LoginPage.test.tsx`: **prueba de integración** que simula completar y enviar el formulario de login (mockea solo la llamada a la API).

Para correrlas:

```bash
npm run test
```
