import { BRAND } from "@/shared/config/brand";
import { darkTheme } from "@/shared/config/theme";

describe("darkTheme", () => {
  it("el fondo y el primario salen de los colores de marca", () => {
    expect(darkTheme.colors.background).toBe(BRAND.night);
    expect(darkTheme.colors.primary).toBe(BRAND.violet);
    expect(darkTheme.gradients.brand).toEqual([BRAND.night, BRAND.deep, BRAND.night]);
  });

  it("el área táctil mínima es de 44", () => {
    expect(darkTheme.touchTarget).toBeGreaterThanOrEqual(44);
  });

  it("todos los colores son valores de color válidos", () => {
    for (const value of Object.values(darkTheme.colors)) {
      expect(value).toMatch(/^(#[0-9a-fA-F]{6}|rgba\()/);
    }
  });
});
