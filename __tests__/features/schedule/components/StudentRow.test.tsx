import { fireEvent, render, screen } from "@testing-library/react-native";

import { StudentRow } from "@/features/schedule/components/StudentRow";

import { classStudent } from "../../../helpers/scheduleFactories";

describe("StudentRow", () => {
  it("el círculo con sus iniciales, su nombre y su nivel; se lee de una vez", () => {
    render(<StudentRow student={classStudent()} index={0} />);

    expect(screen.getByLabelText("Lucía Romero, Nivel 2,5")).toBeTruthy();
    expect(screen.getByText("LR", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("2,5", { includeHiddenElements: true })).toBeTruthy();
  });

  it("quien recupera lleva su etiqueta", () => {
    render(<StudentRow student={classStudent({ is_recovery: true })} index={0} />);

    expect(screen.getByLabelText("Lucía Romero, Recuperación, Nivel 2,5")).toBeTruthy();
    expect(screen.getByText("Recuperación", { includeHiddenElements: true })).toBeTruthy();
  });

  it("sin matrícula en la sede, sin nivel", () => {
    render(<StudentRow student={classStudent({ level: null })} index={0} />);

    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
  });

  it("sin `onMark` (la clase no ha empezado), sin botones", () => {
    render(<StudentRow student={classStudent()} index={0} />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("con `onMark`, ✓ y ✗ con su marca elegida; tocar uno marca al alumno", () => {
    const onMark = jest.fn();
    const student = classStudent({ attendance: "absent" });
    render(<StudentRow student={student} index={0} onMark={onMark} />);

    expect(screen.getByRole("button", { name: "Marcar ausente a Lucía Romero" }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole("button", { name: "Marcar presente a Lucía Romero" }));

    expect(onMark).toHaveBeenCalledWith(student, "present");
  });
});
