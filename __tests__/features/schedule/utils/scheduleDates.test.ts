import {
  addDays,
  localToday,
  MONTH_GRID_DAYS,
  monthGrid,
  wallNow,
} from "@/features/schedule/utils/scheduleDates";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

// Un instante hecho con la hora local: los tests valen en cualquier zona.
const localInstant = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min).getTime();

describe("wallNow", () => {
  it("es la hora del teléfono en el mismo formato que las clases", () => {
    expect(wallNow(localInstant(2026, 10, 5, 16, 30))).toBe(wallAsUtcMs("2026-10-05", "16:30:00"));
  });
});

describe("localToday", () => {
  it("es el día del teléfono, también de madrugada", () => {
    expect(localToday(localInstant(2026, 10, 5, 0, 5))).toBe("2026-10-05");
    expect(localToday(localInstant(2026, 10, 5, 23, 59))).toBe("2026-10-05");
  });
});

describe("addDays", () => {
  it("suma y resta días, cambiando de mes y de año", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  it("el cambio de hora de octubre no mueve el día", () => {
    expect(addDays("2026-10-24", 1)).toBe("2026-10-25");
    expect(addDays("2026-10-25", 1)).toBe("2026-10-26");
  });
});

describe("monthGrid", () => {
  it("va del lunes de la semana del día 1 a 42 días después", () => {
    // Octubre de 2026 empieza en jueves: el lunes anterior es el 28 de septiembre.
    expect(monthGrid("2026-10-18")).toEqual({ from: "2026-09-28", to: "2026-11-08" });
  });

  it("un mes que empieza en lunes empieza en su día 1", () => {
    // Junio de 2026 empieza en lunes.
    expect(monthGrid("2026-06-10")).toEqual({ from: "2026-06-01", to: "2026-07-12" });
  });

  it("un mes que empieza en domingo arranca seis días antes", () => {
    // Noviembre de 2026 empieza en domingo.
    expect(monthGrid("2026-11-01").from).toBe("2026-10-26");
  });

  it("todos los días del mes piden el mismo rango, de 42 días", () => {
    const { from, to } = monthGrid("2026-10-01");
    expect(monthGrid("2026-10-31")).toEqual({ from, to });
    expect(addDays(from, MONTH_GRID_DAYS - 1)).toBe(to);
  });
});
