import { LOCALES, loadDictionary } from "@/shared/locales";

// Rutas de todas las hojas: "errors.byStatus.400", "splash.tagline"…
const leafPaths = (node: object, prefix = ""): string[] =>
  Object.entries(node).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key}`]
      : leafPaths(value as object, `${prefix}${key}.`),
  );

describe("diccionarios", () => {
  const reference = leafPaths(loadDictionary("es")).sort();

  it.each(LOCALES)("%s tiene exactamente las mismas claves que es", (locale) => {
    expect(leafPaths(loadDictionary(locale)).sort()).toEqual(reference);
  });

  it.each(LOCALES)("%s no tiene textos vacíos", (locale) => {
    const dictionary = loadDictionary(locale);
    const empty = leafPaths(dictionary).filter((path) => {
      const value = path.split(".").reduce<unknown>(
        (node, key) => (node as Record<string, unknown>)[key],
        dictionary,
      );
      return typeof value !== "string" || value.trim() === "";
    });
    expect(empty).toEqual([]);
  });
});
