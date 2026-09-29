import { colorAt } from "@/features/schedule/utils/colorAt";
import { darkTheme } from "@/shared/config/theme";

const palette = darkTheme.clubColors;

describe("colorAt", () => {
  it("cada posición toma su color, sin repetir hasta cinco", () => {
    const colors = [0, 1, 2, 3, 4].map((i) => colorAt(palette, i).color);
    expect(new Set(colors).size).toBe(5);
    expect(colorAt(palette, 0)).toBe(palette[0]);
  });

  it("con más elementos que colores vuelve a empezar", () => {
    expect(colorAt(palette, 5)).toBe(palette[0]);
    expect(colorAt(palette, 7)).toBe(palette[2]);
  });
});
