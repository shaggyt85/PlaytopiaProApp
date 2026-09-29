import { relativeDay } from "@/features/schedule/utils/relativeDay";
import { t } from "@/shared/config/i18n";

describe("relativeDay", () => {
  it("hoy no dice nada: basta la hora", () => {
    expect(relativeDay("2026-10-05", "2026-10-05", t)).toBe("");
  });

  it("mañana, «Mañana», también a fin de mes", () => {
    expect(relativeDay("2026-10-06", "2026-10-05", t)).toBe("Mañana");
    expect(relativeDay("2026-11-01", "2026-10-31", t)).toBe("Mañana");
  });

  it("otro día, el día de la semana y su número", () => {
    expect(relativeDay("2026-10-12", "2026-10-05", t)).toBe("lunes 12");
  });
});
