import { readdirSync } from "fs";
import { join, relative, sep } from "path";

import { ROUTES } from "@/shared/config/routes";
import { TABS } from "@/shared/config/tabs";

const APP_DIR = join(__dirname, "../../../src/app");

/** Los ficheros de `src/app/`, sin contar los `_layout`. */
const routeFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.startsWith("_") ? [path] : [];
  });

/**
 * La ruta que crea un fichero, como expo-router: sin los grupos (`(app)`,
 * `(auth)`, `(tabs)`), sin la extensión, e `index` es la raíz de su carpeta.
 */
const routeOf = (file: string): string => {
  const segments = relative(APP_DIR, file)
    .replace(/\.tsx?$/, "")
    .split(sep)
    .filter((segment) => !/^\(.*\)$/.test(segment) && segment !== "index");
  return `/${segments.join("/")}`;
};

describe("ROUTES", () => {
  it("cada ruta una sola vez", () => {
    const hrefs = Object.values(ROUTES);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("cada ruta tiene su fichero en src/app (Href no lo comprueba)", () => {
    const existing = new Set(routeFiles(APP_DIR).map(routeOf));

    for (const href of Object.values(ROUTES)) expect(existing).toContain(href);
  });

  it("las pestañas toman su ruta de aquí", () => {
    expect(TABS.map(({ href }) => href)).toEqual([ROUTES.home, ROUTES.groups, ROUTES.profile]);
  });
});
