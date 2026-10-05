import { attendanceState } from "@/features/schedule/utils/attendanceWindow";

const window = {
  attendance_opens_at: "2026-10-05T14:00:00Z",
  attendance_closes_at: "2026-10-07T22:00:00Z",
};
const at = (iso: string) => Date.parse(iso);

describe("attendanceState", () => {
  it("antes de que abra, aún no se puede pasar lista", () => {
    expect(attendanceState(window, at("2026-10-05T13:59:00Z"))).toBe("notYet");
  });

  it("desde que abre y hasta que cierra, se puede", () => {
    expect(attendanceState(window, at("2026-10-05T14:00:00Z"))).toBe("open");
    expect(attendanceState(window, at("2026-10-07T21:59:00Z"))).toBe("open");
  });

  it("el cierre es exclusivo: a esa hora ya pasó el plazo", () => {
    expect(attendanceState(window, at("2026-10-07T22:00:00Z"))).toBe("closed");
  });
});
