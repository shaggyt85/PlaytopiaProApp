import { roleLine } from "@/features/profile/utils/roleLine";
import { t } from "@/shared/config/i18n";

describe("roleLine", () => {
  it("sin años de experiencia, solo el rol", () => {
    expect(roleLine(null, t)).toBe("Entrenador");
  });

  it("con 0, menos de un año (nunca «0 años»)", () => {
    expect(roleLine(0, t)).toBe("Entrenador · menos de un año de experiencia");
  });

  it("con 1, en singular", () => {
    expect(roleLine(1, t)).toBe("Entrenador · 1 año de experiencia");
  });

  it("con varios, en plural", () => {
    expect(roleLine(6, t)).toBe("Entrenador · 6 años de experiencia");
  });
});
