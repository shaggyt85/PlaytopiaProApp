import { fireEvent, render, screen } from "@testing-library/react-native";

import { PreviousClassSheet } from "@/features/schedule/components/PreviousClassSheet";
import type { AttendanceState } from "@/features/schedule/utils/attendanceWindow";

import { classStudent, scheduleClass } from "../../../helpers/scheduleFactories";

const lucia = classStudent({ attendance: "present", level: null });
const previous = scheduleClass({
  id: 30,
  title: "Cantera Intermedios",
  class_date: "2026-09-14",
  students: [lucia],
});

const renderSheet = (attendance: AttendanceState, onMark = jest.fn(), visible = true, item = previous) =>
  render(<PreviousClassSheet item={item} attendance={attendance} onMark={onMark} visible={visible} onClose={jest.fn()} />);

describe("PreviousClassSheet", () => {
  it("abierto: «Última clase», su título, día y asistencia, y su lista con las marcas", () => {
    renderSheet("closed");

    expect(screen.getByRole("header", { name: "Última clase" })).toBeTruthy();
    expect(screen.getByText("Cantera Intermedios · Lun 14 sept · Asistencia 1/1")).toBeTruthy();
    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Marcar presente a Lucía Romero" }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it("tocar una marca la pasa a quien decide (marcar o decir por qué no)", () => {
    const onMark = jest.fn();
    renderSheet("open", onMark);

    fireEvent.press(screen.getByRole("button", { name: "Marcar ausente a Lucía Romero" }));

    expect(onMark).toHaveBeenCalledWith(lucia, "absent");
  });

  it("cerrado, o sin clase anterior, no se ve", () => {
    renderSheet("closed", jest.fn(), false);
    expect(screen.queryByTestId("previous-class-sheet")).toBeNull();

    renderSheet("closed", jest.fn(), true, null as never);
    expect(screen.queryByTestId("previous-class-sheet")).toBeNull();
  });
});
