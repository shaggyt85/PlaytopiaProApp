import { fireEvent, render, screen } from "@testing-library/react-native";

import { StudentRow } from "@/features/schedule/components/StudentRow";
import type { AttendanceState } from "@/features/schedule/utils/attendanceWindow";

import { classStudent } from "../../../helpers/scheduleFactories";

const renderRow = (
  student = classStudent(),
  attendance: AttendanceState = "notYet",
  onMark = jest.fn(),
) => render(<StudentRow student={student} index={0} attendance={attendance} onMark={onMark} />);

describe("StudentRow", () => {
  it("el círculo con sus iniciales, su nombre y su nivel; se lee de una vez", () => {
    renderRow();

    expect(screen.getByLabelText("Lucía Romero, Nivel 2,5")).toBeTruthy();
    expect(screen.getByText("LR", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("2,5", { includeHiddenElements: true })).toBeTruthy();
  });

  it("quien recupera lleva su etiqueta", () => {
    renderRow(classStudent({ is_recovery: true }));

    expect(screen.getByLabelText("Lucía Romero, Recuperación, Nivel 2,5")).toBeTruthy();
    expect(screen.getByText("Recuperación", { includeHiddenElements: true })).toBeTruthy();
  });

  it("sin matrícula en la sede, sin nivel", () => {
    renderRow(classStudent({ level: null }));

    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
  });

  it("antes de que se pueda pasar lista, sin botones", () => {
    renderRow();

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("con la asistencia abierta, ✓ y ✗ con su marca elegida; tocar uno marca al alumno", () => {
    const onMark = jest.fn();
    const student = classStudent({ attendance: "absent" });
    renderRow(student, "open", onMark);

    expect(screen.getByRole("button", { name: "Marcar ausente a Lucía Romero" }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole("button", { name: "Marcar presente a Lucía Romero" }));

    expect(onMark).toHaveBeenCalledWith(student, "present");
  });

  it("pasado el plazo, la marca a la vista y atenuada; tocarla avisa a quien dice por qué", () => {
    const onMark = jest.fn();
    const student = classStudent({ attendance: "present" });
    renderRow(student, "closed", onMark);

    const present = screen.getByRole("button", { name: "Marcar presente a Lucía Romero" });
    expect(present.props.accessibilityState).toMatchObject({ selected: true });
    expect(present).toHaveStyle({ opacity: 0.5 });
    fireEvent.press(screen.getByRole("button", { name: "Marcar ausente a Lucía Romero" }));

    expect(onMark).toHaveBeenCalledWith(student, "absent");
  });
});
