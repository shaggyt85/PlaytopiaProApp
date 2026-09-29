import { blockGeometry, nowOffset } from "@/features/schedule/utils/timelineGeometry";

const span = { start: 8, end: 21 };
const HOUR = 64;

describe("blockGeometry", () => {
  it("coloca la clase desde el inicio de la franja y la alarga según su duración", () => {
    // 16:00–17:15: 8 horas desde las 08:00 y hora y cuarto de alto.
    expect(blockGeometry({ start: 960, end: 1035 }, span, HOUR, 40)).toEqual({ top: 512, height: 80 });
  });

  it("una clase corta no baja del alto mínimo", () => {
    expect(blockGeometry({ start: 480, end: 495 }, span, HOUR, 40)).toEqual({ top: 0, height: 40 });
  });
});

describe("nowOffset", () => {
  it("es la distancia desde el inicio de la franja", () => {
    expect(nowOffset(9 * 60 + 30, span, HOUR)).toBe(96);
  });

  it("vale en los dos bordes de la franja", () => {
    expect(nowOffset(8 * 60, span, HOUR)).toBe(0);
    expect(nowOffset(21 * 60, span, HOUR)).toBe(13 * HOUR);
  });

  it("fuera de la franja no hay línea", () => {
    expect(nowOffset(7 * 60 + 59, span, HOUR)).toBeNull();
    expect(nowOffset(21 * 60 + 1, span, HOUR)).toBeNull();
  });
});
