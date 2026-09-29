import { changeLanguage } from "@/shared/config/i18n";
import { wallAsUtcMs } from "@/shared/utils/clubClock";
import {
  capitalize,
  formatClubDate,
  formatClubTime,
  formatDayMonth,
  formatDayMonthShort,
  formatMonthYear,
  formatInstant,
  formatNumericDate,
  formatWallTime,
  formatWeekdayDate,
  formatWeekdayDay,
  formatWeekdayInitials,
} from "@/shared/utils/formatDate";

describe("formatDate", () => {
  it("la hora de pared del club se muestra tal cual, sin desplazarla", () => {
    expect(formatClubTime("18:00:00")).toBe("18:00");
  });

  it("la hora siempre con dos cifras, como el prototipo", () => {
    expect(formatClubTime("08:05:00")).toBe("08:05");
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

describe("formatWallTime", () => {
  it("una hora de pared se muestra tal cual, sin desplazarla", () => {
    expect(formatWallTime(wallAsUtcMs("2026-10-05", "15:21:40"))).toBe("15:21");
  });
});

describe("formatWeekdayDay", () => {
  it("el día de la semana y su número, en el idioma activo y sin moverse de día", async () => {
    expect(formatWeekdayDay("2026-10-05")).toBe("lunes 5");

    await changeLanguage("en");
    expect(formatWeekdayDay("2026-10-05")).toBe("Monday 5");
  });
});

describe("formatDayMonth y formatDayMonthShort", () => {
  it("día y mes, en largo y en corto, en el idioma activo", async () => {
    expect(formatDayMonth("2026-11-18")).toBe("18 de noviembre");
    expect(formatDayMonthShort("2026-11-18")).toBe("18 nov");

    await changeLanguage("en");
    expect(formatDayMonth("2026-11-18")).toBe("November 18");
    expect(formatDayMonthShort("2026-11-18")).toBe("Nov 18");
  });
});

describe("formatMonthYear", () => {
  it("mes y año en la forma de cada idioma", async () => {
    expect(formatMonthYear("2026-11-18")).toBe("noviembre de 2026");

    await changeLanguage("en");
    expect(formatMonthYear("2026-11-18")).toBe("November 2026");
  });
});

describe("capitalize", () => {
  it("la primera letra en mayúscula, el resto igual", () => {
    expect(capitalize("lunes 18")).toBe("Lunes 18");
    expect(capitalize("")).toBe("");
  });
});

describe("formatWeekdayInitials", () => {
  it("las letras de lunes a domingo, en el idioma activo", async () => {
    expect(formatWeekdayInitials()).toEqual(["L", "M", "X", "J", "V", "S", "D"]);

    await changeLanguage("en");
    expect(formatWeekdayInitials()).toEqual(["M", "T", "W", "T", "F", "S", "S"]);
  });

  it("se calculan una vez por idioma", () => {
    expect(formatWeekdayInitials()).toBe(formatWeekdayInitials());
  });
});
