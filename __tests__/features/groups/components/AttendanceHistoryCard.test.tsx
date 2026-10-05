import { render, screen } from "@testing-library/react-native";

import { AttendanceHistoryCard } from "@/features/groups/components/AttendanceHistoryCard";

import { attendanceEntry, studentAttendance } from "../../../helpers/groupAttendanceFactories";

const recent = [
  attendanceEntry({ class_id: 1, class_date: "2026-09-14", status: "present" }),
  attendanceEntry({ class_id: 2, class_date: "2026-09-21", status: "absent" }),
  attendanceEntry({ class_id: 3, class_date: "2026-09-28", status: "absent" }),
];

describe("AttendanceHistoryCard", () => {
  it("las últimas clases, cuántas vino y cada una en su orden, tal como llegan", () => {
    render(<AttendanceHistoryCard attendance={studentAttendance({ recent, present: 1 })} />);

    expect(screen.getByText("Últimas 3 clases")).toBeTruthy();
    expect(screen.getByText("1/3", { includeHiddenElements: true })).toBeTruthy();
    const dates = ["14/9", "21/9", "28/9"].map(
      (date) => screen.getByText(date, { includeHiddenElements: true }).props.children,
    );
    expect(dates).toEqual(["14/9", "21/9", "28/9"]);
  });

  it("el aviso de Core en oro, y la fila se lee de una vez con él", () => {
    render(
      <AttendanceHistoryCard
        attendance={studentAttendance({ recent, present: 1, alert: { kind: "consecutive_absences", count: 2 } })}
      />,
    );

    expect(screen.getByTestId("attendance-alert")).toBeTruthy();
    expect(screen.getByLabelText("Vino a 1 de 3 clases, 2 ausencias seguidas")).toBeTruthy();
  });

  it("sin aviso, no sale", () => {
    render(<AttendanceHistoryCard attendance={studentAttendance({ recent, present: 1 })} />);

    expect(screen.queryByTestId("attendance-alert")).toBeNull();
    expect(screen.getByLabelText("Vino a 1 de 3 clases")).toBeTruthy();
  });
});
