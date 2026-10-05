import { StudentDetailParamsSchema, studentDetailHref } from "@/features/groups/utils/studentRoute";

describe("studentRoute", () => {
  it("lo que arma la ruta lo acepta su esquema", () => {
    const { pathname, params } = studentDetailHref({ dbId: 4, groupId: 11, studentId: 55 });

    expect(pathname).toBe("/student/[dbId]/[groupId]/[studentId]");
    expect(StudentDetailParamsSchema.parse(params)).toEqual({ dbId: 4, groupId: 11, studentId: 55 });
  });

  it("unos parámetros que no son de un alumno de un grupo no pasan", () => {
    expect(StudentDetailParamsSchema.safeParse({ dbId: "4", groupId: "11", studentId: "x" }).success).toBe(false);
    expect(StudentDetailParamsSchema.safeParse({ dbId: "4", groupId: "11" }).success).toBe(false);
  });
});
