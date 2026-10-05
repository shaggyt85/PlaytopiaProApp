import { ClassDetailParamsSchema, classDetailHref } from "@/shared/utils/classRoute";

import { scheduleClass } from "../../helpers/scheduleFactories";

describe("classDetailHref y ClassDetailParamsSchema", () => {
  it("la ruta lleva la escuela, la clase y su fecha", () => {
    expect(classDetailHref(scheduleClass({ db_id: 4, id: 31, class_date: "2026-11-18" }))).toEqual({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-11-18" },
    });
  });

  it("lo que arma la ruta lo acepta el detalle, ya como números", () => {
    const { params } = classDetailHref(scheduleClass({ db_id: 4, id: 31, class_date: "2026-11-18" }));

    expect(ClassDetailParamsSchema.parse(params)).toEqual({ dbId: 4, classId: 31, date: "2026-11-18" });
  });

  it("rechaza lo que no es una clase: ids no numéricos, sin fecha o con otra forma", () => {
    expect(ClassDetailParamsSchema.safeParse({ dbId: "x", classId: "31", date: "2026-11-18" }).success).toBe(false);
    expect(ClassDetailParamsSchema.safeParse({ dbId: "4", classId: "31" }).success).toBe(false);
    expect(ClassDetailParamsSchema.safeParse({ dbId: "4", classId: "0", date: "18/11/2026" }).success).toBe(false);
  });
});
