import { layoutDay } from "@/features/schedule/utils/dayLayout";

const slot = (id: number, from: string, to: string) => {
  const minutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return { id, start: minutes(from), end: minutes(to) };
};

describe("layoutDay", () => {
  it("sin clases no hay nada que colocar", () => {
    expect(layoutDay([]).size).toBe(0);
  });

  it("una clase sola ocupa todo el ancho", () => {
    expect(layoutDay([slot(1, "09:00", "10:00")]).get(1)).toEqual({ column: 0, columns: 1 });
  });

  it("dos que coinciden van lado a lado", () => {
    const placements = layoutDay([slot(1, "16:00", "17:15"), slot(2, "16:00", "17:00")]);
    expect(placements.get(1)).toEqual({ column: 1, columns: 2 });
    expect(placements.get(2)).toEqual({ column: 0, columns: 2 });
  });

  it("una que empieza justo cuando otra termina no se solapa", () => {
    const placements = layoutDay([slot(1, "09:00", "10:00"), slot(2, "10:00", "11:00")]);
    expect(placements.get(1)).toEqual({ column: 0, columns: 1 });
    expect(placements.get(2)).toEqual({ column: 0, columns: 1 });
  });

  it("tres solapadas usan tres columnas", () => {
    const placements = layoutDay([
      slot(1, "16:00", "18:00"),
      slot(2, "16:30", "17:30"),
      slot(3, "17:00", "18:00"),
    ]);
    expect(new Set([1, 2, 3].map((id) => placements.get(id)?.column))).toEqual(new Set([0, 1, 2]));
    expect([1, 2, 3].every((id) => placements.get(id)?.columns === 3)).toBe(true);
  });

  it("una columna que se libera se reutiliza dentro del mismo grupo", () => {
    // La larga ocupa la 0; la primera corta deja libre la 1 y la última la reutiliza.
    const placements = layoutDay([
      slot(1, "16:00", "19:00"),
      slot(2, "16:00", "17:00"),
      slot(3, "17:30", "18:30"),
    ]);
    expect(placements.get(3)).toEqual({ column: placements.get(2)?.column, columns: 2 });
  });

  it("grupos separados en el día no se estrechan entre sí", () => {
    const placements = layoutDay([
      slot(1, "09:00", "10:00"),
      slot(2, "09:30", "10:30"),
      slot(3, "18:00", "19:00"),
    ]);
    expect(placements.get(3)).toEqual({ column: 0, columns: 1 });
  });
});
