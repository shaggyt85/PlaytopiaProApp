import { layoutDay } from "@/features/schedule/utils/dayLayout";

// Las medidas de la vista Día: 80 por hora y 94 de alto mínimo (86 de tarjeta y 8 de separación).
const HOUR = 80;
const MIN = 94;

const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const slot = (id: number, from: string, to: string) => ({ id, start: minutes(from), end: minutes(to) });
const layout = (...slots: ReturnType<typeof slot>[]) => layoutDay(slots, HOUR, MIN);

describe("layoutDay", () => {
  it("sin clases no hay nada que colocar ni que estirar", () => {
    expect(layout()).toEqual({ blocks: new Map(), stretches: [] });
  });

  it("una clase sola: en su hora, con su alto, y sin estirar nada", () => {
    const { blocks, stretches } = layout(slot(1, "09:00", "10:30"));

    expect(blocks.get(1)).toEqual({ groupStart: minutes("09:00"), top: 0, height: 120 });
    expect(stretches).toEqual([]);
  });

  it("una clase corta mide el mínimo, sin estirar su hora", () => {
    const { blocks, stretches } = layout(slot(1, "09:00", "09:30"));

    expect(blocks.get(1)?.height).toBe(MIN);
    expect(stretches).toEqual([]);
  });

  it("dos a la misma hora y de la misma duración: una debajo de otra, y su tramo se estira", () => {
    const { blocks, stretches } = layout(slot(1, "18:00", "19:30"), slot(2, "18:00", "19:30"));

    expect(blocks.get(1)).toEqual({ groupStart: minutes("18:00"), top: 0, height: 120 });
    expect(blocks.get(2)).toEqual({ groupStart: minutes("18:00"), top: 120, height: 120 });
    // De 18:00 a 19:30 (120) caben las dos (240): el doble.
    expect(stretches).toEqual([{ start: minutes("18:00"), end: minutes("19:30"), factor: 2 }]);
  });

  it("tres a la vez: tres de alto", () => {
    const { blocks, stretches } = layout(
      slot(1, "18:00", "19:30"),
      slot(2, "18:00", "19:30"),
      slot(3, "18:00", "19:30"),
    );

    expect([1, 2, 3].map((id) => blocks.get(id)?.top)).toEqual([0, 120, 240]);
    expect(stretches[0].factor).toBe(3);
  });

  it("dos que se pisan en parte: la segunda en su hora si cabe o justo debajo de la primera", () => {
    const { blocks, stretches } = layout(slot(1, "18:00", "19:30"), slot(2, "18:30", "20:00"));

    // La de las 18:30 caería a 40, dentro de la primera (120): baja hasta 120.
    expect(blocks.get(2)).toEqual({ groupStart: minutes("18:00"), top: 120, height: 120 });
    // De 18:00 a 20:00 (160) pasan a medir 240.
    expect(stretches).toEqual([{ start: minutes("18:00"), end: minutes("20:00"), factor: 240 / 160 }]);
  });

  it("una seguida de otra que no se pisan: cada una en su hora, sin estirar", () => {
    const { blocks, stretches } = layout(slot(1, "09:00", "10:30"), slot(2, "10:30", "12:00"));

    expect(blocks.get(1)?.groupStart).toBe(minutes("09:00"));
    expect(blocks.get(2)).toEqual({ groupStart: minutes("10:30"), top: 0, height: 120 });
    expect(stretches).toEqual([]);
  });

  it("dos cortas seguidas, cuyas tarjetas sí se pisarían: se apilan y su tramo se estira lo justo", () => {
    const { blocks, stretches } = layout(slot(1, "09:00", "09:30"), slot(2, "09:30", "10:00"));

    expect(blocks.get(2)).toEqual({ groupStart: minutes("09:00"), top: MIN, height: MIN });
    expect(stretches).toHaveLength(1);
    expect(stretches[0].start).toBe(minutes("09:00"));
  });

  it("grupos separados en el día no se tocan entre sí", () => {
    const { blocks, stretches } = layout(
      slot(1, "09:00", "10:30"),
      slot(2, "09:00", "10:30"),
      slot(3, "18:00", "19:30"),
    );

    expect(blocks.get(3)).toEqual({ groupStart: minutes("18:00"), top: 0, height: 120 });
    expect(stretches).toHaveLength(1);
    expect(stretches[0].start).toBe(minutes("09:00"));
  });
});
