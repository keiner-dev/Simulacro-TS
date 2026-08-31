// Importamos los hooks de React: useEffect (para efecto de sincronización) y useState (estado local).
import { useEffect, useState } from "react";
// Importamos la capa de peticiones tipada request, que definimos en lib/api.
import { request } from "@/lib/api";

// Interface que define qué devuelve el hook useFetch.
// Es un type genérico <T>: el dato cargado será de tipo T.
interface UseFetchResult<T> {
  // data: los datos ya tipados, o null mientras no se hayan cargado.
  data: T | null;
  // loading: true mientras la petición está en curso, false cuando termina.
  loading: boolean;
  // error: el error (si hubo) durante la petición, o null si no hubo.
  error: Error | null;
  // refetch: función para volver a disparar la petición manualmente (sin cambiar la url).
  refetch: () => void;
}

// Hook genérico reutilizable para hacer GET y recibir datos tipados.
// Se dispara automáticamente desde un useEffect (no en el cuerpo del componente),
// y controlamos la dependencia para no generar peticiones infinitas.
export function useFetch<T>(url: string): UseFetchResult<T> {
  // Estado para guardar los datos de tipo T cargados desde la API (inicia en null).
  const [data, setData] = useState<T | null>(null);
  // Estado para saber si la petición está cargando (inicia en true porque arranca cargando).
  const [loading, setLoading] = useState(true);
  // Estado para guardar el error ocurrido, si lo hubo (inicia en null).
  const [error, setError] = useState<Error | null>(null);
  // Estado "reloadKey": un contador que, al cambiar, fuerza a re-ejecutar el efecto
  // (así "refetch" puede recargar sin necesidad de cambiar la url).
  const [reloadKey, setReloadKey] = useState(0);

  // Efecto de sincronización: se ejecuta cada vez que cambia "url" o "reloadKey".
  useEffect(() => {
    // Bandera "cancelled": previene llamar a setState si el componente se desmontó
    // antes de que responda la API (evita errores de "setState on unmounted component"
    // y condiciones de carrera).
    let cancelled = false;

    // Función asíncrona auto-invocada que hace la petición (async/await).
    (async () => {
      // Marcamos que empieza a cargar y limpiamos el error anterior.
      // Lo hacemos dentro de la función asíncrona (no sincrónicamente en el cuerpo
      // del efecto) para respetar las nuevas reglas de React sobre setState en efectos.
      setLoading(true);
      setError(null);
      try {
        // Llamamos a la capa request tipada con GET y la url recibida.
        const result = await request<T>("get", url);
        // Si el componente sigue montado (no cancelado), guardamos los datos.
        if (!cancelled) setData(result);
      } catch (err) {
        // Si hubo error y el componente sigue montado, lo guardamos en el estado error.
        if (!cancelled) setError(err as Error);
      } finally {
        // En finally (pase lo que pase) detenemos el loading, si el componente sigue montado.
        if (!cancelled) setLoading(false);
      }
    })();

    // Cleanup del efecto: se ejecuta al desmontar o al cambiar url/reloadKey.
    return () => {
      // Marcamos cancelled como true para que no se hagan setState en un componente muerto.
      cancelled = true;
    };
    // Dependencias del efecto. "url" cambia cuando la ruta/consulta cambia;
    // "reloadKey" solo cambia cuando se llama a refetch. Así se evitan peticiones infinitas.
  }, [url, reloadKey]);

  // Función refetch: incrementa reloadKey para disparar de nuevo el efecto (recargar datos).
  const refetch = () => setReloadKey((k) => k + 1);

  // Devolvemos el objeto con los datos, el estado de carga, el error y la función de recarga.
  return { data, loading, error, refetch };
}
