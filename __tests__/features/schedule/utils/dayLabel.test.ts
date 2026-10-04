import { dayLabel } from "@/features/schedule/utils/dayLabel";
import { changeLanguage, t } from "@/shared/config/i18n";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

describe("dayLabel", () => {
  it("hoy lo dice delante del día", () => {
    expect(dayLabel(formatWeekdayDay("2026-10-05"), true, t)).toBe("Hoy · lunes 5");
  });

  it("otro día, solo el día", () => {
    expect(dayLabel(formatWeekdayDay("2026-10-06"), false, t)).toBe("martes 6");
  });

  it("en el idioma activo", async () => {
    await changeLanguage("en");

    expect(dayLabel(formatWeekdayDay("2026-10-05"), true, t)).toBe("Today · Monday 5");
  });
});
