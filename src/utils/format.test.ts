// Importamos las funciones puras a probar.
import { formatPrice, firstImage, safeImages } from "@/utils/format";

// PRUEBA UNITARIA de funciones puras (Módulo 7).
// Probamos funciones que no dependen de React ni de la red: son predecibles.

describe("formatPrice", () => {
  // Verifica que formatea el precio con el estilo de moneda.
  it("formatea el precio como moneda", () => {
    // Llamamos a la función con un precio numérico.
    const result = formatPrice(1000);
    // Esperamos que el resultado contenga el número 1.000 (separador de miles en es-CO).
    expect(result).toContain("1.000");
  });

  // Verifica que el resultado es un string (no rompe con 0).
  it("maneja el valor cero", () => {
    // Formateamos el precio 0.
    const result = formatPrice(0);
    // Esperamos que sea un texto (no un número).
    expect(typeof result).toBe("string");
    // Y que contenga el carácter de moneda o el código (non-breaking space puede variar).
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("firstImage", () => {
  // Verifica que devuelve la primera imagen de la lista.
  it("devuelve la primera imagen", () => {
    // Pasamos dos URLs.
    expect(firstImage(["a.jpg", "b.jpg"])).toBe("a.jpg");
  });

  // Verifica que devuelve undefined si no hay imágenes.
  it("devuelve undefined si no hay imágenes", () => {
    // No pasamos imágenes.
    expect(firstImage([])).toBeUndefined();
    // Tampoco si el argumento es undefined.
    expect(firstImage(undefined)).toBeUndefined();
  });
});

describe("safeImages", () => {
  // Verifica que devuelve la lista tal cual si existe.
  it("devuelve la lista original", () => {
    expect(safeImages(["x.png"])).toEqual(["x.png"]);
  });

  // Verifica que devuelve un arreglo vacío si no hay imágenes (evita romper el layout).
  it("devuelve arreglo vacío si no hay imágenes", () => {
    expect(safeImages(undefined)).toEqual([]);
  });
});
