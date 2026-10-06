import { professionalDefaults } from "@/features/profile/utils/professionalDefaults";

import { teacherProfile } from "../../../helpers/profileFactories";

const CATALOG = [
  {
    code: "padel",
    name: "Pádel",
    specialties: [
      { code: "technique", name: "Técnica" },
      { code: "tactics", name: "Táctica" },
      { code: "competition", name: "Competición" },
    ],
  },
  { code: "tennis", name: "Tenis", specialties: [] },
];

describe("professionalDefaults", () => {
  it("el formulario con lo guardado", () => {
    expect(professionalDefaults(teacherProfile(), CATALOG)).toEqual({
      experienceYears: 6,
      description: "Entrenador de pádel especializado en cantera y competición.",
      sports: [{ code: "padel", specialties: ["technique", "tactics"] }],
    });
  });

  it("sin presentación, vacía; sin años, sin decir", () => {
    expect(professionalDefaults(teacherProfile({ description: null, experience_years: null }), CATALOG)).toMatchObject({
      description: "",
      experienceYears: null,
    });
  });

  it("solo lo que el catálogo aún ofrece: Core rechazaría lo desactivado", () => {
    const profile = teacherProfile({
      sports: [
        { code: "padel", name: "Pádel", specialties: [{ code: "technique", name: "Técnica" }, { code: "old", name: "Vieja" }] },
        { code: "squash", name: "Squash", specialties: [] },
      ],
    });

    expect(professionalDefaults(profile, CATALOG).sports).toEqual([{ code: "padel", specialties: ["technique"] }]);
  });

  it("un deporte que se queda sin ninguna de sus especialidades no se envía", () => {
    const profile = teacherProfile({
      sports: [{ code: "padel", name: "Pádel", specialties: [{ code: "old", name: "Vieja" }] }],
    });

    expect(professionalDefaults(profile, CATALOG).sports).toEqual([]);
  });

  it("un deporte sin especialidades en el catálogo se conserva", () => {
    const profile = teacherProfile({ sports: [{ code: "tennis", name: "Tenis", specialties: [] }] });

    expect(professionalDefaults(profile, CATALOG).sports).toEqual([{ code: "tennis", specialties: [] }]);
  });
});
