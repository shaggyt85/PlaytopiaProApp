import { isChosen, toggleSpecialty } from "@/features/profile/utils/toggleSpecialty";

describe("toggleSpecialty", () => {
  it("elige una especialidad de un deporte que aún no estaba", () => {
    expect(toggleSpecialty([], "padel", "technique")).toEqual([{ code: "padel", specialties: ["technique"] }]);
  });

  it("añade otra al mismo deporte", () => {
    expect(toggleSpecialty([{ code: "padel", specialties: ["technique"] }], "padel", "tactics")).toEqual([
      { code: "padel", specialties: ["technique", "tactics"] },
    ]);
  });

  it("quitar la última deja el deporte sin elegir", () => {
    expect(toggleSpecialty([{ code: "padel", specialties: ["technique"] }], "padel", "technique")).toEqual([]);
  });

  it("un deporte sin especialidades se elige y se quita entero", () => {
    const chosen = toggleSpecialty([], "tennis", null);
    expect(chosen).toEqual([{ code: "tennis", specialties: [] }]);
    expect(toggleSpecialty(chosen, "tennis", null)).toEqual([]);
  });

  it("no toca la lista de entrada ni los otros deportes", () => {
    const chosen = [{ code: "tennis", specialties: [] }, { code: "padel", specialties: ["technique"] }];
    const copy = structuredClone(chosen);

    expect(toggleSpecialty(chosen, "padel", "tactics")).toContainEqual({ code: "tennis", specialties: [] });
    expect(chosen).toEqual(copy);
  });
});

describe("isChosen", () => {
  const chosen = [{ code: "padel", specialties: ["technique"] }, { code: "tennis", specialties: [] }];

  it("una especialidad, si está en su deporte", () => {
    expect(isChosen(chosen, "padel", "technique")).toBe(true);
    expect(isChosen(chosen, "padel", "tactics")).toBe(false);
  });

  it("sin especialidad, si está el deporte", () => {
    expect(isChosen(chosen, "tennis", null)).toBe(true);
    expect(isChosen(chosen, "squash", null)).toBe(false);
  });
});
