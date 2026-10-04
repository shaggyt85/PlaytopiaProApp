import { nowOffset, timelineScale } from "@/features/schedule/utils/timelineGeometry";

const span = { start: 8, end: 21 };
const HOUR = 80;
const at = (h: number, m = 0) => h * 60 + m;

describe("timelineScale", () => {
  it("sin tramos estirados: 80 por hora desde el inicio de la franja", () => {
    const scale = timelineScale(span, HOUR);

    expect(scale.yOf(at(8))).toBe(0);
    expect(scale.yOf(at(16, 30))).toBe(8.5 * HOUR);
    expect(scale.height).toBe(13 * HOUR);
  });

  it("un tramo estirado al doble: dentro crece al doble y lo de después se desplaza", () => {
    const scale = timelineScale(span, HOUR, [{ start: at(18), end: at(19), factor: 2 }]);

    expect(scale.yOf(at(18))).toBe(10 * HOUR);
    // Las 18:30, a mitad del tramo estirado.
    expect(scale.yOf(at(18, 30))).toBe(10 * HOUR + HOUR);
    expect(scale.yOf(at(19))).toBe(12 * HOUR);
    expect(scale.yOf(at(20))).toBe(13 * HOUR);
    expect(scale.height).toBe(14 * HOUR);
  });

  it("antes de un tramo estirado, nada cambia", () => {
    const scale = timelineScale(span, HOUR, [{ start: at(18), end: at(19), factor: 3 }]);

    expect(scale.yOf(at(10))).toBe(2 * HOUR);
  });

  it("varios tramos se suman en orden", () => {
    const scale = timelineScale(span, HOUR, [
      { start: at(18), end: at(19), factor: 2 },
      { start: at(9), end: at(10), factor: 2 },
    ]);

    expect(scale.yOf(at(18))).toBe(10 * HOUR + HOUR);
    expect(scale.height).toBe(15 * HOUR);
  });
});

describe("nowOffset", () => {
  const scale = timelineScale(span, HOUR, [{ start: at(18), end: at(19), factor: 2 }]);

  it("con la misma escala que las clases", () => {
    expect(nowOffset(at(9, 30), span, scale)).toBe(1.5 * HOUR);
    // Dentro del tramo estirado, en su proporción.
    expect(nowOffset(at(18, 30), span, scale)).toBe(11 * HOUR);
  });

  it("vale en los dos bordes de la franja", () => {
    expect(nowOffset(at(8), span, scale)).toBe(0);
    expect(nowOffset(at(21), span, scale)).toBe(scale.height);
  });

  it("fuera de la franja no hay línea", () => {
    expect(nowOffset(at(7, 59), span, scale)).toBeNull();
    expect(nowOffset(at(21, 1), span, scale)).toBeNull();
  });
});
