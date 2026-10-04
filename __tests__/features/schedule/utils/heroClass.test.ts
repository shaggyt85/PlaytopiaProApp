import { heroClass, heroLabel } from "@/features/schedule/utils/heroClass";
import { wallAsUtcMs } from "@/shared/utils/clubClock";
import { t } from "@/shared/config/i18n";

import { nextClass, scheduleClass } from "../../../helpers/scheduleFactories";

// Una hora de pared del lunes 5 de octubre, el día de las clases de ejemplo.
const wall = (time: string) => wallAsUtcMs("2026-10-05", time);

describe("heroClass", () => {
  const morning = scheduleClass({ id: 1, class_time: "10:00:00", duration_minutes: 60 });
  const afternoon = scheduleClass({ id: 2, class_time: "16:00:00", duration_minutes: 75 });
  const next = nextClass({ id: 3, class_time: "19:00:00" });

  it("si hay una clase en curso, esa, aunque Core ya dé la siguiente como próxima", () => {
    expect(heroClass([morning, afternoon], next, wall("16:30:00"))).toEqual({ item: afternoon, live: true });
  });

  it("si no hay ninguna en curso, la próxima de Core", () => {
    expect(heroClass([morning, afternoon], next, wall("12:00:00"))).toEqual({ item: next, live: false });
  });

  it("dos a la vez en curso: la que empezó antes", () => {
    const early = scheduleClass({ id: 4, class_time: "15:30:00", duration_minutes: 90 });
    expect(heroClass([afternoon, early], next, wall("16:30:00"))).toEqual({ item: early, live: true });
  });

  it("ni en curso ni próxima: nada", () => {
    expect(heroClass([morning], null, wall("12:00:00"))).toBeNull();
  });
});

describe("heroLabel", () => {
  // Empieza a las 16:00 de Madrid (14:00 UTC).
  const cantera = { item: nextClass(), live: false } as const;
  const START = Date.parse("2026-10-05T14:00:00Z");
  const MINUTE = 60_000;

  it("en curso", () => {
    expect(heroLabel({ item: scheduleClass(), live: true }, "2026-10-05", START, t)).toBe("En curso");
  });

  it("hoy, a una hora o menos: cuánto falta, redondeando hacia arriba", () => {
    expect(heroLabel(cantera, "2026-10-05", START - 60 * MINUTE, t)).toBe("Próxima clase · en 60 min");
    expect(heroLabel(cantera, "2026-10-05", START - 30_000, t)).toBe("Próxima clase · en 1 min");
  });

  it("hoy, a más de una hora: a qué hora", () => {
    expect(heroLabel(cantera, "2026-10-05", START - 61 * MINUTE, t)).toBe("Próxima clase · hoy 16:00");
  });

  it("mañana u otro día", () => {
    expect(heroLabel(cantera, "2026-10-04", START, t)).toBe("Próxima clase · mañana 16:00");
    expect(heroLabel(cantera, "2026-10-01", START, t)).toMatch(/^Próxima clase · lun\.? 5 · 16:00$/);
  });
});
