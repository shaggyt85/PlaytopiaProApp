import { changeLanguage, t } from "@/shared/config/i18n";
import { seatsLabel, studentsLabel } from "@/shared/utils/seatsLabel";

describe("seatsLabel", () => {
  it("las plazas a secas, «ocupadas/total» (donde ya pone «Alumnos» encima)", () => {
    expect(seatsLabel({ current_participants: 2, max_participants: 4 })).toBe("2/4");
    expect(seatsLabel({ current_participants: 0, max_participants: 12 })).toBe("0/12");
  });
});

describe("studentsLabel", () => {
  it("las plazas con lo que son: el número solo no dice nada", () => {
    expect(studentsLabel({ current_participants: 3, max_participants: 4 }, t)).toBe("3/4 alumnos");
  });

  it("en el idioma activo", async () => {
    await changeLanguage("en");

    expect(studentsLabel({ current_participants: 3, max_participants: 4 }, t)).toBe("3/4 students");
  });
});
