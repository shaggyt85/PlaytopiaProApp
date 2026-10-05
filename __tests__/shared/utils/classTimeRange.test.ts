import { t } from "@/shared/config/i18n";
import { classSpan, classTimeRange } from "@/shared/utils/classTimeRange";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

describe("classTimeRange", () => {
  it("de la hora de inicio a la de fin, según su duración", () => {
    expect(classTimeRange({ class_date: "2026-11-18", class_time: "08:30:00", duration_minutes: 60 }, t)).toBe(
      "08:30–09:30",
    );
    expect(classTimeRange({ class_date: "2026-11-18", class_time: "07:30:00", duration_minutes: 90 }, t)).toBe(
      "07:30–09:00",
    );
  });

  it("una clase que pasa de medianoche acaba al día siguiente", () => {
    expect(classTimeRange({ class_date: "2026-11-18", class_time: "23:30:00", duration_minutes: 60 }, t)).toBe(
      "23:30–00:30",
    );
  });
});

describe("classSpan", () => {
  it("empieza a su hora y termina tras su duración", () => {
    const at = (time: string) => wallAsUtcMs("2026-10-05", time);
    expect(classSpan({ class_date: "2026-10-05", class_time: "16:00:00", duration_minutes: 75 })).toEqual({
      start: at("16:00:00"),
      end: at("17:15:00"),
    });
  });
});
