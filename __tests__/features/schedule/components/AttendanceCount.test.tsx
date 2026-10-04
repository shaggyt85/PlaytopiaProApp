import { render, screen } from "@testing-library/react-native";

import { AttendanceCount } from "@/features/schedule/components/AttendanceCount";
import { darkTheme } from "@/shared/config/theme";

describe("AttendanceCount", () => {
  it("mientras falta alguno, cuántos han venido, en gris", () => {
    render(<AttendanceCount summary={{ present: 2, total: 4, complete: false }} />);

    expect(screen.getByText("2/4 presentes")).toHaveStyle({ color: darkTheme.colors.textSecondary });
  });

  it("con todos marcados, «Asistencia registrada» en el color de marca", () => {
    render(<AttendanceCount summary={{ present: 3, total: 4, complete: true }} />);

    expect(screen.getByText("Asistencia registrada · 3/4")).toHaveStyle({ color: darkTheme.colors.primary });
  });
});
