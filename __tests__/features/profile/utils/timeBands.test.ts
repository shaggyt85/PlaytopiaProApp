import {
  OFFERED_HOURS,
  TIME_BANDS,
  applyBands,
  bandHours,
  bandsOf,
  hoursBetween,
} from "@/features/profile/utils/timeBands";
import { LAST_HOUR } from "@/features/profile/schemas/weeklyHours.schema";

describe("hoursBetween y OFFERED_HOURS", () => {
  it("las horas en punto, los dos extremos incluidos", () => {
    expect(hoursBetween(6, 9)).toEqual([6, 7, 8, 9]);
  });

  it("se ofrecen de las 06:00 a la última, sin la 24", () => {
    expect(OFFERED_HOURS[0]).toBe(6);
    expect(OFFERED_HOURS.at(-1)).toBe(LAST_HOUR);
  });
});

describe("TIME_BANDS", () => {
  it("ninguna franja lleva una hora que no existe", () => {
    expect(Math.max(...TIME_BANDS.flatMap((band) => band.hours))).toBe(LAST_HOUR);
  });

  it("mañana, tarde y noche juntas son el día entero", () => {
    expect(bandHours(["morning", "afternoon", "evening"])).toEqual(bandHours(["allDay"]));
  });
});

describe("applyBands", () => {
  it("cada día marcado con las horas de las franjas marcadas", () => {
    expect(applyBands({ days: ["1", "3"], bands: ["evening"] })).toEqual({
      "1": [18, 19, 20, 21, 22, 23],
      "3": [18, 19, 20, 21, 22, 23],
    });
  });

  it("sin franjas o sin días, la semana vacía", () => {
    expect(applyBands({ days: ["1"], bands: [] })).toEqual({});
    expect(applyBands({ days: [], bands: ["morning"] })).toEqual({});
  });
});

describe("bandsOf", () => {
  it("una semana de franjas iguales en varios días: esos días y esas franjas", () => {
    const week = applyBands({ days: ["1", "4"], bands: ["afternoon", "evening"] });

    expect(bandsOf(week)).toEqual({ days: ["1", "4"], bands: ["afternoon", "evening"] });
  });

  it("todo el día marca todas las franjas, como la app de alumnos", () => {
    expect(bandsOf({ "2": hoursBetween(6, 23) }).bands).toEqual(["morning", "afternoon", "evening", "allDay"]);
  });

  it("horas sueltas o distintas por día: los días, pero ninguna franja", () => {
    expect(bandsOf({ "1": [16, 17], "2": [9] })).toEqual({ days: ["1", "2"], bands: [] });
    expect(bandsOf({ "1": hoursBetween(6, 11), "2": hoursBetween(12, 17) }).bands).toEqual([]);
  });

  it("la semana vacía: nada marcado", () => {
    expect(bandsOf({})).toEqual({ days: [], bands: [] });
  });
});
