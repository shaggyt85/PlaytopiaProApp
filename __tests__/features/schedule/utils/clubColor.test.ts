import { clubColor } from "@/features/schedule/utils/clubColor";
import { darkTheme } from "@/shared/config/theme";

const palette = darkTheme.clubColors;

describe("clubColor", () => {
  it("cada club toma el color de su posición, sin repetir hasta cinco", () => {
    const colors = [0, 1, 2, 3, 4].map((i) => clubColor(palette, i).color);
    expect(new Set(colors).size).toBe(5);
    expect(clubColor(palette, 0)).toBe(palette[0]);
  });

  it("con más clubes que colores vuelve a empezar", () => {
    expect(clubColor(palette, 5)).toBe(palette[0]);
    expect(clubColor(palette, 7)).toBe(palette[2]);
  });
});
