import { TeacherProfileSchema } from "@/shared/schemas/teacherProfile.schema";

// El TeacherResponse de Core trae más campos; la app solo se queda con los suyos.
const teacherResponse = {
  id: 42,
  name: "David",
  last_name: "García",
  email: "david@club.com",
  avatar: "https://img.test/avatars/teacher/42.jpg",
  terms_version: "2026-07-01",
  accepted_terms_at: "2026-09-26T10:00:00",
};

describe("TeacherProfileSchema", () => {
  it("acepta el perfil de Core y se queda solo con lo que usa la app", () => {
    expect(TeacherProfileSchema.parse(teacherResponse)).toEqual({
      id: 42,
      name: "David",
      avatar: "https://img.test/avatars/teacher/42.jpg",
      terms_version: "2026-07-01",
      accepted_terms_at: "2026-09-26T10:00:00",
    });
  });

  it("acepta los términos sin aceptar (null, p. ej. alta desde el CRM)", () => {
    const profile = TeacherProfileSchema.parse({ ...teacherResponse, terms_version: null, accepted_terms_at: null });

    expect(profile.terms_version).toBeNull();
  });

  it.each(["id", "name", "avatar", "terms_version"])("rechaza un perfil sin %s", (field) => {
    const { [field as keyof typeof teacherResponse]: _removed, ...incomplete } = teacherResponse;

    expect(() => TeacherProfileSchema.parse(incomplete)).toThrow();
  });
});
