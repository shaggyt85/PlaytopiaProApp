import { ENDPOINTS } from "@/shared/config/endpoints";

describe("ENDPOINTS", () => {
  it("lo que se hace con una clase cuelga de la misma ruta de la clase", () => {
    expect(ENDPOINTS.MOBILE_TEACHER.ATTENDANCE(4, 31, 55)).toBe("/MobileTeacher/classes/4/31/attendance/55");
    expect(ENDPOINTS.MOBILE_TEACHER.PREVIOUS(4, 31)).toBe("/MobileTeacher/classes/4/31/previous");
    expect(ENDPOINTS.MOBILE_TEACHER.GROUP_ATTENDANCE(4, 31)).toBe("/MobileTeacher/classes/4/31/group-attendance");
  });

  it("el perfil es el del profesor que se pide", () => {
    expect(ENDPOINTS.TEACHERS.PROFILE(7)).toBe("/UserTeacher/7");
  });

  it("todas las rutas son relativas a la URL base, que ya lleva /api", () => {
    const fixed = Object.values(ENDPOINTS).flatMap((group) =>
      Object.values(group).filter((route): route is string => typeof route === "string"),
    );

    expect(fixed.length).toBeGreaterThan(0);
    for (const route of fixed) {
      expect(route).toMatch(/^\/(?!api\/)/);
    }
  });
});
