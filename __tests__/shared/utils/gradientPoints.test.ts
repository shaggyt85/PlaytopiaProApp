import { gradientPoints } from "@/shared/utils/gradientPoints";

describe("gradientPoints", () => {
  it("135°: de arriba a la izquierda a abajo a la derecha, justo en las esquinas", () => {
    expect(gradientPoints(135)).toEqual({ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } });
  });

  it("los ejes: 180° de arriba abajo y 90° de izquierda a derecha", () => {
    expect(gradientPoints(180)).toEqual({ start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } });
    expect(gradientPoints(90)).toEqual({ start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } });
  });

  it("160° (el `gradient-ink`): casi vertical, algo inclinado a la derecha", () => {
    const { start, end } = gradientPoints(160);

    expect(start.x).toBeCloseTo(0.2807, 3);
    expect(start.y).toBeCloseTo(-0.1025, 3);
    expect(end.x).toBeCloseTo(0.7193, 3);
    expect(end.y).toBeCloseTo(1.1025, 3);
  });
});
