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

  it.each([
    ["es", "Viernes · 20 de noviembre"],
    ["en", "Friday · November 20"],
    ["pt", "Sexta-feira · 20 de novembro"],
    ["ca", "Divendres · 20 de novembre"],
    ["de", "Freitag · 20. November"],
    ["fr", "Vendredi · 20 novembre"],
  ] as const)("el día de la cabecera en %s: %s", async (locale, expected) => {
    await changeLanguage(locale);
    // Mediodía: el mismo día en cualquier zona horaria en la que se ejecute el test.
    expect(formatWeekdayDate(new Date(2026, 10, 20, 12, 0))).toBe(expected);
  });

  it("reutiliza el formateador: no crea uno nuevo en cada fecha", () => {
    const create = jest.spyOn(Intl, "DateTimeFormat");
    const day = new Date(2026, 10, 20, 12, 0);
    formatWeekdayDate(day);
    const afterFirst = create.mock.calls.length;

    formatWeekdayDate(day);
    formatWeekdayDate(day);

    expect(create.mock.calls.length).toBe(afterFirst);
    create.mockRestore();
  });
});
