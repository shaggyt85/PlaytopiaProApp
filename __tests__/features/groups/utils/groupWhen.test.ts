import { groupWhen } from "@/features/groups/utils/groupWhen";
import { changeLanguage, t } from "@/shared/config/i18n";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const next = scheduleClass({ class_date: "2026-10-05", class_time: "18:00:00", duration_minutes: 90 });

describe("groupWhen", () => {
  it("con varias clases, sus días de la semana y la hora de la próxima", () => {
    expect(groupWhen({ key: "4-11", next, weekdayDates: ["2026-10-05", "2026-10-07"], upcoming: 6 }, t)).toBe(
      "Lunes, miércoles · 18:00–19:30",
    );
  });

  it("con una sola clase por delante, su fecha: no se repite ningún día", () => {
    expect(groupWhen({ key: "4-11", next, weekdayDates: ["2026-10-05"], upcoming: 1 }, t)).toBe(
      "Lun 5 oct · 18:00–19:30",
    );
  });

  it("en el idioma activo", async () => {
    await changeLanguage("en");

    // La hora va en el formato del idioma (con su espacio fino antes de «PM»).
    expect(groupWhen({ key: "4-11", next, weekdayDates: ["2026-10-05"], upcoming: 2 }, t)).toMatch(/^Monday · 06:00/);
  });
});
