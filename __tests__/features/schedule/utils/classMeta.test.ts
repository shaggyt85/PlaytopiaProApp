import { classMeta, durationMeta } from "@/features/schedule/utils/classMeta";
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

describe("durationMeta", () => {
  it("la duración y lo que se añade detrás, sin la hora", () => {
    expect(durationMeta(cantera, t, ["Wave Padel Club", "Pista 2"])).toBe("75 min · Wave Padel Club · Pista 2");
  });

  it("lo que falta no deja separador", () => {
    expect(durationMeta(cantera, t, ["", "Pista 2"])).toBe("75 min · Pista 2");
  });
});
