import {
  isServerClockCalibrated,
  recordServerDate,
  resetServerClock,
  serverNow,
  serverNowSeconds,
} from "@/shared/utils/serverClock";

describe("serverClock", () => {
  beforeEach(() => {
    resetServerClock();
    jest.spyOn(Date, "now").mockReturnValue(Date.parse("2026-09-26T10:00:00Z"));
  });

  afterEach(() => jest.restoreAllMocks());

  it("sin calibrar usa la hora del móvil", () => {
    expect(isServerClockCalibrated()).toBe(false);
    expect(serverNow()).toBe(Date.parse("2026-09-26T10:00:00Z"));
  });

  it("aprende el desfase de la cabecera Date (móvil 5 minutos atrasado)", () => {
    recordServerDate("Sat, 26 Sep 2026 10:05:00 GMT");

    expect(isServerClockCalibrated()).toBe(true);
    expect(serverNow()).toBe(Date.parse("2026-09-26T10:05:00Z"));
    expect(serverNowSeconds()).toBe(Date.parse("2026-09-26T10:05:00Z") / 1000);
  });

  it("ignora cabeceras ausentes o ilegibles sin romper nada", () => {
    recordServerDate(undefined);
    recordServerDate("");
    recordServerDate("no es una fecha");

    expect(isServerClockCalibrated()).toBe(false);
    expect(serverNow()).toBe(Date.parse("2026-09-26T10:00:00Z"));
  });
});
