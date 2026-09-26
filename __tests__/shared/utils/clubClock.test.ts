import {
  clubInstant,
  clubToday,
  DEFAULT_CLUB_TIMEZONE,
  hasClassStarted,
  parseTimezone,
  toClubTime,
} from "@/shared/utils/clubClock";

// Mismos casos que los tests de club_clock.rs en Core.
const utc = (iso: string) => Date.parse(`${iso}Z`);

describe("clubToday", () => {
  it("en Madrid la madrugada ya es el día siguiente aunque UTC no", () => {
    expect(clubToday("Europe/Madrid", utc("2026-08-24T23:30:00"))).toBe("2026-08-25");
    expect(clubToday("Europe/Madrid", utc("2026-08-25T00:13:00"))).toBe("2026-08-25");
  });

  it("en Nueva York la tarde todavía es hoy", () => {
    expect(clubToday("America/New_York", utc("2026-08-25T01:00:00"))).toBe("2026-08-24");
  });
});

describe("clubInstant", () => {
  it("una clase de las 18:00 en Madrid en agosto son las 16:00 UTC", () => {
    expect(clubInstant("2026-08-25", "18:00:00", "Europe/Madrid")).toBe(
      utc("2026-08-25T16:00:00"),
    );
  });

  it("la misma clase en invierno cae una hora después en UTC", () => {
    expect(clubInstant("2026-01-15", "18:00:00", "Europe/Madrid")).toBe(
      utc("2026-01-15T17:00:00"),
    );
  });

  it("en Nueva York el desfase es de cuatro horas", () => {
    expect(clubInstant("2026-08-25", "21:00:00", "America/New_York")).toBe(
      utc("2026-08-26T01:00:00"),
    );
  });

  it("una hora que el reloj se salta avanza a la primera que existe", () => {
    // El 29/03/2026 Madrid salta de las 02:00 a las 03:00.
    expect(clubInstant("2026-03-29", "02:30:00", "Europe/Madrid")).toBe(
      utc("2026-03-29T01:00:00"),
    );
  });

  it("una hora que se repite toma la primera", () => {
    // El 25/10/2026 Madrid vuelve de las 03:00 a las 02:00: las 02:30 existen dos veces.
    expect(clubInstant("2026-10-25", "02:30:00", "Europe/Madrid")).toBe(
      utc("2026-10-25T00:30:00"),
    );
  });

  it("un día sin medianoche empieza en la primera hora que existe (Chile)", () => {
    const instant = clubInstant("2026-09-06", "00:00:00", "America/Santiago");
    expect(toClubTime(instant, "America/Santiago").format("YYYY-MM-DD HH:mm")).toBe(
      "2026-09-06 01:00",
    );
  });
});

describe("parseTimezone", () => {
  it("una zona desconocida cae en la de por defecto en vez de romper", () => {
    expect(parseTimezone("Marte/Olympus")).toBe(DEFAULT_CLUB_TIMEZONE);
    expect(parseTimezone(undefined)).toBe(DEFAULT_CLUB_TIMEZONE);
    expect(parseTimezone("America/New_York")).toBe("America/New_York");
  });

  it("la de por defecto es la misma que en Core", () => {
    expect(DEFAULT_CLUB_TIMEZONE).toBe("Europe/Madrid");
  });
});

describe("toClubTime", () => {
  it("un instante UTC se ve en la hora del club", () => {
    expect(toClubTime("2026-08-25T16:00:00Z", "Europe/Madrid").format("HH:mm")).toBe(
      "18:00",
    );
  });
});

describe("hasClassStarted", () => {
  const clase = ["2026-08-25", "18:00:00", "Europe/Madrid"] as const;

  it("antes de la hora del club no ha empezado; a la hora, sí", () => {
    expect(hasClassStarted(...clase, utc("2026-08-25T15:59:00"))).toBe(false);
    expect(hasClassStarted(...clase, utc("2026-08-25T16:00:00"))).toBe(true);
  });
});
