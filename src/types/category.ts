// Type del dominio para una Categoría, según lo que devuelve la API.
// Lo definimos una sola vez y lo reutilizamos en services, páginas y componentes
// (cumplimiento: no repetimos la misma forma de objeto a mano en varios archivos).
export interface Category {
  // id: identificador único de la categoría (la API usa UUIDs -> string).
  id: string;
  // name: nombre de la categoría (siempre presente, es obligatorio según CreateCategoryDto).
  name: string;
  // description: descripción de la categoría. Es opcional ("?") porque la API no lo exige.
  description?: string;
  // createdAt: fecha de creación, la API la devuelve como string ISO.
  createdAt: string;
}
