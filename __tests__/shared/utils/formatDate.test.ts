import { changeLanguage } from "@/shared/config/i18n";
import {
  formatClubDate,
  formatClubTime,
  formatInstant,
  formatNumericDate,
  formatWeekdayDate,
} from "@/shared/utils/formatDate";

describe("formatDate", () => {
  it("la hora de pared del club se muestra tal cual, sin desplazarla", () => {
    expect(formatClubTime("18:00:00")).toBe("18:00");
  });

  it("la fecha de clase se muestra en el idioma activo", async () => {
    expect(formatClubDate("2026-09-26", "long")).toBe("26 de septiembre de 2026");

    await changeLanguage("en");
    expect(formatClubDate("2026-09-26", "long")).toBe("September 26, 2026");
  });

  it("la fecha en cifras sigue el orden del idioma y no se mueve de día", async () => {
    expect(formatNumericDate("1990-05-03")).toBe("03/05/1990");

    await changeLanguage("en");
    expect(formatNumericDate("1990-05-03")).toBe("05/03/1990");

    await changeLanguage("de");
    expect(formatNumericDate("1990-05-03")).toBe("03.05.1990");
  });

  it("un instante UTC se muestra en la hora del club", () => {
    expect(
      formatInstant("2026-08-25T16:00:00Z", "Europe/Madrid", { time: "short" }),
    ).toBe("18:00");
    expect(
      formatInstant("2026-08-25T16:00:00Z", "America/New_York", { time: "short" }),
    ).toBe("12:00");
  });

  it("el día de la cabecera: semana con mayúscula y fecha en la forma de cada idioma", async () => {
    // Mediodía: el mismo día en cualquier zona horaria en la que se ejecute el test.
    const friday = new Date(2026, 10, 20, 12, 0);
    expect(formatWeekdayDate(friday)).toBe("Viernes · 20 de noviembre");

    await changeLanguage("en");
    expect(formatWeekdayDate(friday)).toBe("Friday · November 20");
  });
});
