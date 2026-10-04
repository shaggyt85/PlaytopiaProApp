import { attendanceSummary } from "@/features/schedule/utils/attendanceSummary";

describe("attendanceSummary", () => {
  it("cuenta los presentes de la lista", () => {
    expect(
      attendanceSummary([{ attendance: "present" }, { attendance: "absent" }, { attendance: null }, { attendance: "present" }]),
    ).toEqual({ present: 2, total: 4, complete: false });
  });

  it("con todos marcados, completa aunque falte alguno", () => {
    expect(attendanceSummary([{ attendance: "present" }, { attendance: "absent" }])).toEqual({
      present: 1,
      total: 2,
      complete: true,
    });
  });

  it("sin alumnos no hay nada registrado", () => {
    expect(attendanceSummary([])).toEqual({ present: 0, total: 0, complete: false });
  });
});
