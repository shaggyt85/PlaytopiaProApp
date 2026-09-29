import {
  dayToolbarLabel,
  monthToolbarLabel,
  weekRange,
  weekToolbarLabel,
} from "@/features/schedule/utils/toolbarLabel";
import { changeLanguage, t } from "@/shared/config/i18n";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const NOW = wallAsUtcMs("2026-11-18", "21:41:00");

describe("toolbarLabel", () => {
  it("Día: el día y la hora de ahora", () => {
    expect(dayToolbarLabel("2026-11-18", NOW, t)).toBe("miércoles 18 · 21:41");
  });

  it("Semana: sus extremos y la hora", () => {
    expect(weekToolbarLabel("2026-11-18", NOW, t)).toBe("16 nov – 22 nov · 21:41");
  });

  it("una semana que cambia de mes", () => {
    expect(weekRange("2026-10-01", t)).toBe("28 sept – 4 oct");
  });

  it("Mes: el mes y el año", () => {
    expect(monthToolbarLabel("2026-11-18")).toBe("noviembre de 2026");
  });

  it("en el idioma activo (en inglés, la hora de 12)", async () => {
    await changeLanguage("en");

    expect(weekToolbarLabel("2026-11-18", NOW, t)).toBe("Nov 16 – Nov 22 · 09:41 PM");
  });
});
