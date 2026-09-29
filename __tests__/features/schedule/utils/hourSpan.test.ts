import { visibleHours } from "@/features/schedule/utils/hourSpan";

const DEFAULT = { start: 8, end: 21 };

describe("visibleHours", () => {
  it("sin clases fuera, la franja configurada", () => {
    expect(visibleHours(DEFAULT, [])).toEqual(DEFAULT);
    expect(visibleHours(DEFAULT, [{ start: 9 * 60, end: 10 * 60 }])).toEqual(DEFAULT);
  });

  it("se amplía hasta la hora entera de una clase que empieza antes", () => {
    expect(visibleHours(DEFAULT, [{ start: 6 * 60 + 30, end: 7 * 60 + 30 }])).toEqual({ start: 6, end: 21 });
  });

  it("y hasta la hora entera siguiente de una que termina después", () => {
    expect(visibleHours(DEFAULT, [{ start: 21 * 60, end: 22 * 60 + 15 }])).toEqual({ start: 8, end: 23 });
  });

  it("un club de 24 horas llega hasta las 24:00, sin pasarse", () => {
    expect(visibleHours(DEFAULT, [{ start: 23 * 60 + 30, end: 24 * 60 }])).toEqual({ start: 8, end: 24 });
    expect(visibleHours({ start: 0, end: 24 }, [])).toEqual({ start: 0, end: 24 });
  });
});
