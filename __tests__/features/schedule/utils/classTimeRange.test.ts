import { classTimeRange } from "@/features/schedule/utils/classTimeRange";
import { t } from "@/shared/config/i18n";

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
