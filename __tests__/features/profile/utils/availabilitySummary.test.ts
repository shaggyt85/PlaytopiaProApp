import { availabilitySummary } from "@/features/profile/utils/availabilitySummary";
import { t } from "@/shared/config/i18n";

describe("availabilitySummary", () => {
  it("los días con alguna hora y el total de horas de la semana, como el prototipo", () => {
    expect(availabilitySummary({ "1": [16, 17, 18], "3": [9, 10, 17, 18] }, t)).toBe("2 días · 7 h semanales");
  });

  it("un solo día, en singular", () => {
    expect(availabilitySummary({ "5": [20] }, t)).toBe("1 día · 1 h semanales");
  });

  it("sin ninguna hora, dice que aún no la ha indicado", () => {
    expect(availabilitySummary({}, t)).toBe("Aún no has indicado tu disponibilidad");
    expect(availabilitySummary({ "1": [] }, t)).toBe("Aún no has indicado tu disponibilidad");
  });
});
