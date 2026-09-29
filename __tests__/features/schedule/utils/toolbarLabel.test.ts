import { toolbarLabel } from "@/features/schedule/utils/toolbarLabel";
import { changeLanguage, t } from "@/shared/config/i18n";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const NOW = wallAsUtcMs("2026-11-18", "21:41:00");

describe("toolbarLabel", () => {
  it("en Día, el día y la hora de ahora", () => {
    expect(toolbarLabel("day", "2026-11-18", NOW, t)).toBe("miércoles 18 · 21:41");
  });

  it("en Semana, sus extremos y la hora", () => {
    expect(toolbarLabel("week", "2026-11-18", NOW, t)).toBe("16 nov – 22 nov · 21:41");
  });

  it("una semana que cambia de mes", () => {
    expect(toolbarLabel("week", "2026-10-01", NOW, t)).toBe("28 sept – 4 oct · 21:41");
  });

  it("en Mes, el mes y el año", () => {
    expect(toolbarLabel("month", "2026-11-18", NOW, t)).toBe("noviembre de 2026");
  });

  it("en el idioma activo", async () => {
    await changeLanguage("en");

    expect(toolbarLabel("week", "2026-11-18", NOW, t)).toBe("Nov 16 – Nov 22 · 09:41 PM");
  });
});
