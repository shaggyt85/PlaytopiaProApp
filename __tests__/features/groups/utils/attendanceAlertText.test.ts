import { attendanceAlertText } from "@/features/groups/utils/attendanceAlertText";
import { t } from "@/shared/config/i18n";

describe("attendanceAlertText", () => {
  it("las ausencias seguidas, con las que manda Core", () => {
    expect(attendanceAlertText({ kind: "consecutive_absences", count: 2 }, t)).toBe("2 ausencias seguidas");
  });

  it("las ausencias en las últimas clases, con las dos cifras", () => {
    expect(attendanceAlertText({ kind: "absences_in_last", absences: 3, of: 4 }, t)).toBe(
      "3 ausencias en las últimas 4 clases",
    );
  });
});
