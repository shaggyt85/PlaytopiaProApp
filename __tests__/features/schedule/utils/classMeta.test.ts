import { durationMeta } from "@/features/schedule/utils/classMeta";
import { t } from "@/shared/config/i18n";

const cantera = { duration_minutes: 75 };

describe("durationMeta", () => {
  it("la duración y lo que se añade detrás, sin la hora", () => {
    expect(durationMeta(cantera, t, ["Wave Padel Club", "Pista 2"])).toBe("75 min · Wave Padel Club · Pista 2");
  });

  it("lo que falta no deja separador", () => {
    expect(durationMeta(cantera, t, ["", "Pista 2"])).toBe("75 min · Pista 2");
  });
});
