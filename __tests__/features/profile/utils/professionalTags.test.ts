import { professionalTags } from "@/features/profile/utils/professionalTags";

describe("professionalTags", () => {
  it("las especialidades de cada deporte, en su orden", () => {
    const tags = professionalTags([
      {
        code: "padel",
        name: "Pádel",
        specialties: [
          { code: "technique", name: "Técnica" },
          { code: "tactics", name: "Táctica" },
        ],
      },
    ]);

    expect(tags).toEqual([
      { key: "padel:technique", label: "Técnica" },
      { key: "padel:tactics", label: "Táctica" },
    ]);
  });

  it("un deporte sin especialidades elegidas sale con su nombre", () => {
    expect(professionalTags([{ code: "tennis", name: "Tenis", specialties: [] }])).toEqual([
      { key: "tennis", label: "Tenis" },
    ]);
  });

  it("sin deportes, nada", () => {
    expect(professionalTags([])).toEqual([]);
  });
});
