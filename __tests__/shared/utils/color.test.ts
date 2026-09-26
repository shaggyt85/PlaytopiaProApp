import { withAlpha } from "@/shared/utils/color";

describe("withAlpha", () => {
  it("convierte #RRGGBB a rgba con la transparencia pedida", () => {
    expect(withAlpha("#C21D93", 0.25)).toBe("rgba(194, 29, 147, 0.25)");
    expect(withAlpha("ffffff", 1)).toBe("rgba(255, 255, 255, 1)");
  });

  it("rechaza formatos que no son #RRGGBB", () => {
    expect(() => withAlpha("#fff", 0.5)).toThrow(/Color no válido/);
    expect(() => withAlpha("red", 0.5)).toThrow(/Color no válido/);
  });
});
