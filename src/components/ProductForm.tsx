// Importamos useState, FormEvent y useEffect para el formulario controlado.
import { useState, type FormEvent } from "react";
// Importamos el tipo Product y ProductPayload.
import type { Product, ProductPayload } from "@/types/product";
// Importamos el tipo Category para el select de categorías.
import type { Category } from "@/types/category";
// Importamos ErrorMessage para mostrar errores del servidor.
import ErrorMessage from "./ErrorMessage";
// Importamos ApiError para detectar errores de validación de la API.
import { ApiError } from "@/lib/errors";

// Interface con las props del formulario de producto (componente REUTILIZADO en dos entradas):
// - categories: lista de categorías para el <select> (cuando se crea desde "Productos").
// - presetCategoryId: id de categoría ya fijado (cuando se crea desde una categoría).
// - initialProduct (opcional): si viene, es modo edición (cargamos sus datos).
// - onSubmit: función que se llama con los datos del producto al enviar.
interface ProductFormProps {
  // categories: todas las categorías existentes (para el select).
  categories: Category[];
  // presetCategoryId: id de categoría prefijado (del contexto de la categoría).
  presetCategoryId?: string;
  // initialProduct: producto a editar (si es modo edición).
  initialProduct?: Product;
  // onSubmit: data a enviar + indicador de creación o edición.
  onSubmit: (data: ProductPayload, isEdit: boolean, id?: string) => Promise<void>;
}

// Componente de formulario de producto reutilizado en: crear desde categoría,
// crear desde productos, y editar producto. Un solo formulario detrás de varias entradas.
export default function ProductForm({ categories, presetCategoryId, initialProduct, onSubmit }: ProductFormProps) {
  // Estado controlado: nombre del producto (inicia con el del producto a editar, si existe).
  const [name, setName] = useState(initialProduct?.name ?? "");
  // Estado controlado: descripción (dato opcional).
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  // Estado controlado: precio (como string, lo convertimos a número al enviar).
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  // Estado controlado: stock (como string).
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");
  // Estado controlado: categoría seleccionada. Preferimos la categoría preseleccionada
  // si viene, si no la del producto a editar, si no vacía.
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? presetCategoryId ?? "");
  // Estado controlado: lista de URLs de imágenes (una por línea, separadas por salto de línea).
  const [imagesText, setImagesText] = useState(initialProduct?.images?.join("\n") ?? "");
  // Estado para mostrar errores (de validación local o del servidor).
  const [error, setError] = useState("");
  // Estado para deshabilitar el botón mientras se envía (evita doble envío).
  const [submitting, setSubmitting] = useState(false);

  // Renderizamos el formulario controlado.
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Título según sea creación o edición */}
      <h2 className="text-xl font-bold">{initialProduct ? "Editar producto" : "Crear producto"}</h2>

      {/* Mostramos el error del servidor (si lo hay) */}
      {error && <ErrorMessage message={error} />}

      {/* Campo: Nombre */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nombre *</label>
        <input
          type="text"
          value={name} // valor controlado por el estado.
          onChange={(e) => setName(e.target.value)} // actualiza el estado al escribir.
          required // el navegador exige que no esté vacío.
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Campo: Descripción (opcional) */}
      <div>
        <label className="mb-1 block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Dos columnas: Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        {/* Campo: Precio */}
        <div>
          <label className="mb-1 block text-sm font-medium">Precio *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Campo: Stock */}
        <div>
          <label className="mb-1 block text-sm font-medium">Stock *</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Campo: Categoría. Si hay una categoría preseleccionada (venimos de una categoría),
        mostramos el select cargado y DESHABILITADO (el id ya lo define el contexto).
        Si no, mostramos el select habilitado con todas las categorías. */}
      <div>
        <label className="mb-1 block text-sm font-medium">Categoría *</label>
        <select
          value={categoryId}
          // Si presetCategoryId está definido, deshabilitamos el select (viene del contexto).
          disabled={!!presetCategoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
        >
          {/* Opción placeholder cuando no hay categoría seleccionada */}
          <option value="">Selecciona una categoría</option>
          {/* Recorremos las categorías para generar cada opción del select */}
          {categories.map((cat) => (
            // Cada opción con su id como valor y nombre visible.
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo: Imágenes (texto, una URL por línea). Sin subida de archivos. */}
      <div>
        <label className="mb-1 block text-sm font-medium">Imágenes (URLs, una por línea)</label>
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          placeholder={"https://ejemplo.com/imagen1.jpg\nhttps://ejemplo.com/imagen2.jpg"}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Botón de envío: muestra "Guardando…" mientras se envía */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {submitting ? "Guardando…" : initialProduct ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );

  // Función que maneja el envío del formulario (la definimos debajo del return para
  // poder usar los estados, pero JavaScript la hoistea como declaración de función).
  async function handleSubmit(e: FormEvent) {
    // Evitamos el comportamiento por defecto del formulario (recargar la página).
    e.preventDefault();
    // Reseteamos el error anterior.
    setError("");
    // Convertimos el precio de string a número (parseFloat con valor por defecto 0).
    const priceNum = parseFloat(price) || 0;
    // Convertimos el stock de string a número entero.
    const stockNum = parseInt(stock, 10) || 0;
    // Si no hay categoría seleccionada, mostramos un error y no enviamos.
    if (!categoryId) {
      setError("Debes seleccionar una categoría");
      return;
    }
    // Construimos el payload a enviar: solo incluimos images si hay alguna URL escrita.
    const payload: ProductPayload = {
      name: name.trim(), // nombre sin espacios al inicio/fin.
      description: description.trim() || undefined, // si está vacío lo enviamos como undefined.
      price: priceNum, // precio convertido a número.
      stock: stockNum, // stock convertido a número.
      categoryId: categoryId, // id de la categoría.
      // Filtramos las líneas vacías y convertimos a arreglo (o undefined si no hay).
      images: imagesText
        .split("\n") // dividimos por salto de línea.
        .map((s) => s.trim()) // quitamos espacios.
        .filter(Boolean), // eliminamos líneas vacías.
    };
    // Si la lista de imágenes quedó vacía, la ponemos como undefined.
    if (payload.images?.length === 0) delete payload.images;

    // Activamos el estado "enviando" para deshabilitar el botón.
    setSubmitting(true);
    try {
      // Llamamos al onSubmit que nos pasa el padre (crear o editar).
      await onSubmit(payload, !!initialProduct, initialProduct?.id);
    } catch (err) {
      // Si es un error de la API (ApiError), mostramos su mensaje; el "kind" nos dice
      // qué tipo de error es (validación, red, etc.).
      if (err instanceof ApiError) {
        // Mostramos un mensaje según el tipo de error.
        if (err.kind === "validation") {
          setError(`Datos inválidos: ${err.message}`);
        } else if (err.kind === "network") {
          setError("Problema de conexión con el servidor. Intenta de nuevo.");
        } else {
          setError(err.message || "No se pudo guardar el producto.");
        }
      } else {
        // Si no es ApiError, mostramos un mensaje genérico.
        setError("No se pudo guardar el producto.");
      }
    } finally {
      // En finally apagamos el estado de envío (pase lo que pase).
      setSubmitting(false);
    }
  }
}
