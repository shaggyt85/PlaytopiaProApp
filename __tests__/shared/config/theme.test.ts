import fs from "fs";
import path from "path";

import { BRAND } from "@/shared/config/brand";
import { FONTS } from "@/shared/config/fonts";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

const SRC = path.resolve(__dirname, "../../../src");

/** Todos los ficheros .ts/.tsx de src. */
const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });

const paletteColors: string[] = Object.values(BRAND);

describe("darkTheme", () => {
  it("el fondo, el primario y el degradado de marca salen de la paleta de Lovable", () => {
    expect(darkTheme.colors.background).toBe(BRAND.night);
    expect(darkTheme.colors.primary).toBe(BRAND.magenta);
    expect(darkTheme.gradients.brand).toEqual([BRAND.brandFrom, BRAND.brandVia, BRAND.brandTo]);
  });

  it("el área táctil mínima es de 44", () => {
    expect(darkTheme.touchTarget).toBeGreaterThanOrEqual(44);
  });

  it("todos los colores son valores de color válidos", () => {
    for (const value of Object.values(darkTheme.colors)) {
      expect(value).toMatch(/^(#[0-9a-fA-F]{6}|rgba\()/);
    }
  });

  it("no escribe colores a mano: cada uno es de la paleta o una transparencia de ella", () => {
    const translucent = paletteColors.flatMap((color) =>
      [0.1, 0.25, 0.3, 0.5, 0.72, 0.85, 0.9].map((alpha) => withAlpha(color, alpha)),
    );
    for (const value of Object.values(darkTheme.colors)) {
      expect([...paletteColors, ...translucent]).toContain(value);
    }
  });

  it("cada variante de letra usa una fuente cargada y nunca fontWeight", () => {
    const loaded: string[] = Object.values(FONTS);
    for (const style of Object.values(darkTheme.typography)) {
      expect(loaded).toContain(style.fontFamily);
      expect(style).not.toHaveProperty("fontWeight");
    }
  });

  it("los títulos y la marca van en Sora; el texto, en Inter", () => {
    const { display, brand, title, subtitle, body, button } = darkTheme.typography;
    for (const style of [display, brand, title, subtitle]) expect(style.fontFamily).toMatch(/^Sora_/);
    for (const style of [body, button]) expect(style.fontFamily).toMatch(/^Inter_/);
  });

  it("el brillo acepta cualquier color", () => {
    expect(darkTheme.shadows.glow.shadowColor).toBe(BRAND.glowMagenta);
  });
});

describe("la paleta solo se usa a través del tema", () => {
  it("ningún componente importa brand.js: los colores salen de useTheme()", () => {
    const allowed = [path.join(SRC, "shared", "config", "theme.ts")];
    const offenders = sourceFiles(SRC)
      .filter((file) => !allowed.includes(file))
      .filter((file) => /from ["']@\/shared\/config\/brand["']|from ["']\.\/brand["']/.test(fs.readFileSync(file, "utf8")))
      .map((file) => path.relative(SRC, file));

    expect(offenders).toEqual([]);
  });
});
