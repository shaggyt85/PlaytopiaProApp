import { SCHEDULE_VIEWS } from "@/features/schedule/utils/scheduleViews";
import { t } from "@/shared/config/i18n";

describe("SCHEDULE_VIEWS", () => {
  it("Día, Semana y Mes, en el orden del selector: se abre en Día", () => {
    expect(SCHEDULE_VIEWS.map((view) => view.key)).toEqual(["day", "week", "month"]);
    expect(SCHEDULE_VIEWS.map((view) => t(view.label))).toEqual(["Día", "Semana", "Mes"]);
  });
});
