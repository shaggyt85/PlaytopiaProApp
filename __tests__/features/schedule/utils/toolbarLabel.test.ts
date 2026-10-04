import {
  dayToolbarLabel,
  monthToolbarLabel,
  weekRange,
  weekToolbarLabel,
} from "@/features/schedule/utils/toolbarLabel";
import { changeLanguage, t } from "@/shared/config/i18n";

describe("toolbarLabel", () => {
  it("Día: «Hoy» si es hoy; si no, el día en corto con la primera en mayúscula", () => {
    expect(dayToolbarLabel("2026-11-18", true, t)).toBe("Hoy");
    expect(dayToolbarLabel("2026-11-18", false, t)).toMatch(/^Mié\.? 18 nov\.?$/);
  });

  it("Semana: sus extremos, sin la hora", () => {
    expect(weekToolbarLabel("2026-11-18", false, t)).toBe("16 nov – 22 nov");
  });

  it("una semana que cambia de mes", () => {
    expect(weekRange("2026-10-01", t)).toBe("28 sept – 4 oct");
  });

  it("Mes: el mes y el año, con la primera en mayúscula", () => {
    expect(monthToolbarLabel("2026-11-18")).toBe("Noviembre de 2026");
  });

  it("en el idioma activo", async () => {
    await changeLanguage("en");

    expect(dayToolbarLabel("2026-11-18", true, t)).toBe("Today");
    expect(weekToolbarLabel("2026-11-18", false, t)).toBe("Nov 16 – Nov 22");
  });
});
