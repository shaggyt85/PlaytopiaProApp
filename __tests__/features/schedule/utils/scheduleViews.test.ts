import {
  announceLabel,
  SCHEDULE_VIEW_CONFIG,
  SCHEDULE_VIEWS,
  stepDate,
  toolbarLabel,
} from "@/features/schedule/utils/scheduleViews";
import { t } from "@/shared/config/i18n";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const NOW = wallAsUtcMs("2026-11-18", "21:41:00");

describe("SCHEDULE_VIEWS", () => {
  it("Día, Semana y Mes, en el orden del selector: se abre en Día", () => {
    expect(SCHEDULE_VIEWS.map((view) => view.key)).toEqual(["day", "week", "month"]);
    expect(SCHEDULE_VIEWS.map((view) => t(view.label))).toEqual(["Día", "Semana", "Mes"]);
  });
});

describe("stepDate", () => {
  it("en Día, un día", () => {
    expect(stepDate("2026-10-31", "day", 1)).toBe("2026-11-01");
    expect(stepDate("2026-10-01", "day", -1)).toBe("2026-09-30");
  });

  it("en Semana, siete", () => {
    expect(stepDate("2026-10-29", "week", 1)).toBe("2026-11-05");
    expect(stepDate("2026-10-01", "week", -1)).toBe("2026-09-24");
  });

  it("en Mes, el mismo día del mes siguiente o, si no lo tiene, el último", () => {
    expect(stepDate("2026-11-18", "month", 1)).toBe("2026-12-18");
    expect(stepDate("2027-01-31", "month", 1)).toBe("2027-02-28");
    expect(stepDate("2028-01-31", "month", 1)).toBe("2028-02-29");
    expect(stepDate("2026-03-31", "month", -1)).toBe("2026-02-28");
  });
});

describe("toolbarLabel", () => {
  it("el texto de la barra de cada vista", () => {
    expect(toolbarLabel("day", "2026-11-18", NOW, t)).toBe("miércoles 18 · 21:41");
    expect(toolbarLabel("week", "2026-11-18", NOW, t)).toBe("16 nov – 22 nov · 21:41");
    expect(toolbarLabel("month", "2026-11-18", NOW, t)).toBe("noviembre de 2026");
  });
});

describe("announceLabel", () => {
  it("lo que se anuncia al llegar, sin la hora", () => {
    expect(announceLabel("day", "2026-11-18", true, t)).toBe("Hoy · miércoles 18");
    expect(announceLabel("day", "2026-11-19", false, t)).toBe("jueves 19");
    expect(announceLabel("week", "2026-11-18", true, t)).toBe("16 nov – 22 nov");
    expect(announceLabel("month", "2026-11-18", true, t)).toBe("noviembre de 2026");
  });
});

describe("SCHEDULE_VIEW_CONFIG", () => {
  it("las flechas dicen a dónde van en cada vista", () => {
    const arrows = Object.values(SCHEDULE_VIEW_CONFIG).map(({ previous, next }) => [t(previous), t(next)]);

    expect(arrows).toEqual([
      ["Día anterior", "Día siguiente"],
      ["Semana anterior", "Semana siguiente"],
      ["Mes anterior", "Mes siguiente"],
    ]);
  });
});
