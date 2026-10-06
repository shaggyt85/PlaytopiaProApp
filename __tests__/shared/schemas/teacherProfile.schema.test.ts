import { TeacherProfileSchema } from "@/shared/schemas/teacherProfile.schema";

import { teacherProfile, teacherProfileResponse } from "../../helpers/profileFactories";

describe("TeacherProfileSchema", () => {
  it("acepta el perfil de Core y se queda solo con lo que usa la app", () => {
    expect(TeacherProfileSchema.parse(teacherProfileResponse())).toEqual(teacherProfile());
  });

  it("acepta lo que el profesor no ha dicho (null) y sin deportes", () => {
    const empty = {
      terms_version: null,
      accepted_terms_at: null,
      birthday: null,
      gender: null,
      description: null,
      experience_years: null,
      sports: [],
    };

    expect(TeacherProfileSchema.parse(teacherProfileResponse(empty))).toEqual(teacherProfile(empty));
  });

  it.each(["id", "name", "last_name", "email", "phone_number", "avatar", "terms_version", "sports"])(
    "rechaza un perfil sin %s",
    (field) => {
      const { [field as keyof ReturnType<typeof teacherProfileResponse>]: _removed, ...incomplete } =
        teacherProfileResponse();

      expect(() => TeacherProfileSchema.parse(incomplete)).toThrow();
    },
  );

  it("rechaza una especialidad sin su nombre traducido", () => {
    const sports = [{ code: "padel", name: "Pádel", specialties: [{ code: "technique" }] }];

    expect(() => TeacherProfileSchema.parse({ ...teacherProfileResponse(), sports })).toThrow();
  });
});
