import { GroupAttendanceResponseSchema } from "@/features/groups/schemas/groupAttendance.schema";

import { studentAttendance } from "../../../helpers/groupAttendanceFactories";

describe("GroupAttendanceResponseSchema", () => {
  it("acepta el historial tal como lo manda Core, con los dos avisos y sin aviso", () => {
    const body = {
      students: [
        studentAttendance({ student_id: 1, alert: { kind: "consecutive_absences", count: 2 } }),
        studentAttendance({ student_id: 2, alert: { kind: "absences_in_last", absences: 3, of: 4 } }),
        studentAttendance({ student_id: 3 }),
      ],
    };

    expect(GroupAttendanceResponseSchema.parse(body)).toEqual(body);
  });

  it("una clase sin grupo llega sin alumnos", () => {
    expect(GroupAttendanceResponseSchema.parse({ students: [] })).toEqual({ students: [] });
  });

  it("un aviso que no conoce, o al que le falta una cifra, no cumple el contrato", () => {
    for (const alert of [{ kind: "late_arrivals", count: 2 }, { kind: "absences_in_last", absences: 3 }]) {
      expect(() =>
        GroupAttendanceResponseSchema.parse({ students: [studentAttendance({ alert } as never)] }),
      ).toThrow();
    }
  });

  it("una marca que no es present ni absent no cumple el contrato", () => {
    const student = studentAttendance();
    const body = { students: [{ ...student, recent: [{ ...student.recent[0], status: "late" }] }] };

    expect(() => GroupAttendanceResponseSchema.parse(body)).toThrow();
  });
});
