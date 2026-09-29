import { classMeta } from "@/features/schedule/utils/classMeta";
import { t } from "@/shared/config/i18n";

const cantera = { class_time: "16:00:00", duration_minutes: 75 };

describe("classMeta", () => {
  it("la hora y la duración", () => {
    expect(classMeta(cantera, t)).toBe("16:00 · 75 min");
  });

  it("y lo que añade cada tarjeta detrás", () => {
    expect(classMeta(cantera, t, ["Pista 1"])).toBe("16:00 · 75 min · Pista 1");
  });

  it("lo que falta no deja separador", () => {
    expect(classMeta(cantera, t, [""])).toBe("16:00 · 75 min");
  });
});
