import { availabilitySummary } from "@/features/profile/utils/availabilitySummary";
import { t } from "@/shared/config/i18n";

describe("availabilitySummary", () => {
  it("los días, las horas de la semana y los tramos de cada día", () => {
    expect(availabilitySummary({ "1": [16, 17, 18], "3": [9, 10, 17, 18] }, t)).toEqual({
      title: "2 días · 7 h semanales",
      detail: "Lun 16:00–19:00 · Mié 09:00–11:00 y 17:00–19:00",
    });
  });

  it("de lunes a domingo: el domingo («0» en Core) va el último", () => {
    const { detail } = availabilitySummary({ "0": [10], "1": [9] }, t);

    expect(detail).toBe("Lun 09:00–10:00 · Dom 10:00–11:00");
  });

  it("un solo día, en singular", () => {
    expect(availabilitySummary({ "5": [20] }, t).title).toBe("1 día · 1 h semanales");
  });

  it("un tramo hasta medianoche acaba a las 24:00", () => {
    expect(availabilitySummary({ "6": [22, 23] }, t).detail).toBe("Sáb 22:00–24:00");
  });

  it("sin ninguna hora, dice que aún no la ha indicado", () => {
    expect(availabilitySummary({}, t)).toEqual({ title: "Aún no has indicado tu disponibilidad", detail: "" });
    expect(availabilitySummary({ "1": [] }, t).detail).toBe("");
  });
});
