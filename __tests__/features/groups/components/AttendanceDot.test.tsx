import { render, screen } from "@testing-library/react-native";

import { AttendanceDot } from "@/features/groups/components/AttendanceDot";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

import { attendanceEntry } from "../../../helpers/groupAttendanceFactories";

describe("AttendanceDot", () => {
  it("vino: ✓ en magenta, con la fecha corta del club debajo", () => {
    render(<AttendanceDot entry={attendanceEntry({ class_date: "2026-09-28", status: "present" })} />);

    expect(screen.getByText("28/9")).toBeTruthy();
    expect(screen.getByTestId("attendance-dot-present")).toHaveStyle({
      backgroundColor: withAlpha(darkTheme.colors.primary, 0.15),
    });
  });

  it("faltó: ✗ en coral, como en el detalle de una clase", () => {
    render(<AttendanceDot entry={attendanceEntry({ status: "absent" })} />);

    expect(screen.getByTestId("attendance-dot-absent")).toHaveStyle({
      backgroundColor: withAlpha(darkTheme.accents.coral.color, 0.15),
    });
  });
});
