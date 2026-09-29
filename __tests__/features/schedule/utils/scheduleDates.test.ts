import {
  addDays,
  localMinutes,
  localToday,
  mondayOf,
  monthCells,
  MONTH_GRID_DAYS,
  monthGrid,
  stepDate,
  visibleWeekDays,
  wallNow,
  weekDays,
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

describe("localMinutes", () => {
  it("son los minutos desde las 00:00 del teléfono", () => {
    expect(localMinutes(localInstant(2026, 10, 5, 16, 30))).toBe(990);
    expect(localMinutes(localInstant(2026, 10, 5))).toBe(0);
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

describe("mondayOf", () => {
  it("el lunes de su semana, aunque sea de otro mes o de otro año", () => {
    expect(mondayOf("2026-10-07")).toBe("2026-10-05");
    expect(mondayOf("2026-10-05")).toBe("2026-10-05");
    expect(mondayOf("2026-10-04")).toBe("2026-09-28");
    expect(mondayOf("2027-01-01")).toBe("2026-12-28");
  });
});

describe("weekDays", () => {
  it("los 7 días de su semana, de lunes a domingo", () => {
    expect(weekDays("2026-10-01")).toEqual([
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
    ]);
  });
});

describe("monthCells", () => {
  it("huecos hasta el día 1, los días del mes y huecos hasta completar la semana", () => {
    // Octubre de 2026 empieza en jueves y acaba en sábado.
    const cells = monthCells("2026-10-18");
    expect(cells.slice(0, 4)).toEqual([null, null, null, "2026-10-01"]);
    expect(cells.slice(-2)).toEqual(["2026-10-31", null]);
    expect(cells).toHaveLength(35);
  });

  it("un mes que empieza en lunes no tiene huecos delante", () => {
    expect(monthCells("2026-06-10")[0]).toBe("2026-06-01");
  });

  it("uno que empieza en domingo, seis", () => {
    const cells = monthCells("2026-11-01");
    expect(cells.slice(0, 7)).toEqual([null, null, null, null, null, null, "2026-11-01"]);
  });
});

describe("stepDate", () => {
  it("en Día, un día", () => {
    expect(stepDate("2026-10-31", "day", 1)).toBe("2026-11-01");
    expect(stepDate("2026-10-01", "day", -1)).toBe("2026-09-30");
  });

  it("en Semana, siete", () => {
    expect(stepDate("2026-10-29", "week", 1)).toBe("2026-11-05");
    expect(stepDate("2026-10-01", "week", -1)).toBe("2026-09-24");
  });

  it("en Mes, el mismo día del mes siguiente o, si no lo tiene, el último", () => {
    expect(stepDate("2026-11-18", "month", 1)).toBe("2026-12-18");
    expect(stepDate("2027-01-31", "month", 1)).toBe("2027-02-28");
    expect(stepDate("2028-01-31", "month", 1)).toBe("2028-02-29");
    expect(stepDate("2026-03-31", "month", -1)).toBe("2026-02-28");
  });
});

describe("visibleWeekDays", () => {
  const week = weekDays("2026-10-05");

  it("en la semana actual, de hoy al domingo", () => {
    expect(visibleWeekDays(week, "2026-10-08", null)).toEqual([
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ]);
  });

  it("en otra semana, los 7 días", () => {
    expect(visibleWeekDays(week, "2026-10-15", null)).toEqual(week);
  });

  it("con un día tocado en la tira, solo ese", () => {
    expect(visibleWeekDays(week, "2026-10-08", "2026-10-06")).toEqual(["2026-10-06"]);
  });
});
