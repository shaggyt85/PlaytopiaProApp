import { changeLanguage } from "@/shared/config/i18n";
import { formatClubDate, formatClubTime, formatInstant } from "@/shared/utils/formatDate";

describe("formatDate", () => {
  it("la hora de pared del club se muestra tal cual, sin desplazarla", () => {
    expect(formatClubTime("18:00:00")).toBe("18:00");
  });

  it("la fecha de clase se muestra en el idioma activo", async () => {
    expect(formatClubDate("2026-09-26", "long")).toBe("26 de septiembre de 2026");

    await changeLanguage("en");
    expect(formatClubDate("2026-09-26", "long")).toBe("September 26, 2026");
  });

  it("un instante UTC se muestra en la hora del club", () => {
    expect(
      formatInstant("2026-08-25T16:00:00Z", "Europe/Madrid", { time: "short" }),
    ).toBe("18:00");
    expect(
      formatInstant("2026-08-25T16:00:00Z", "America/New_York", { time: "short" }),
    ).toBe("12:00");
  });
});
