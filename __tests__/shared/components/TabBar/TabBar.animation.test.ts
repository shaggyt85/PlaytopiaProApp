import {
  DROP_ANIMATION,
  indicatorOffset,
  recoilTarget,
} from "@/shared/components/TabBar/TabBar.animation";

describe("indicatorOffset", () => {
  it("coloca la gota bajo cada pestaña según su ancho", () => {
    expect([0, 1, 2, 3, 4].map((index) => indicatorOffset(index, 70))).toEqual([0, 70, 140, 210, 280]);
  });

  it("una ruta sin pestaña (-1) no mueve la gota fuera de la barra", () => {
    expect(indicatorOffset(-1, 70)).toBe(0);
  });
});

describe("recoilTarget", () => {
  const { recoil } = DROP_ANIMATION;

  it("retrocede hacia el lado contrario del salto", () => {
    expect(recoilTarget(140, 280, 280)).toBe(140 - recoil);
    expect(recoilTarget(140, 0, 280)).toBe(140 + recoil);
  });

  it("no se sale de la barra por los extremos", () => {
    expect(recoilTarget(0, 280, 280)).toBe(0);
    expect(recoilTarget(280, 0, 280)).toBe(280);
  });
});
