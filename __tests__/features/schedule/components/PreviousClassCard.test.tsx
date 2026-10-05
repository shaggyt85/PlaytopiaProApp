import { fireEvent, render, screen } from "@testing-library/react-native";

import { PreviousClassCard } from "@/features/schedule/components/PreviousClassCard";

import { classStudent, scheduleClass } from "../../../helpers/scheduleFactories";

const previous = scheduleClass({
  id: 30,
  title: "Cantera Intermedios",
  class_date: "2026-09-14",
  students: [
    classStudent({ student_id: 54, name: "Diego", last_name: "Pérez", attendance: "present" }),
    classStudent({ attendance: "absent" }),
    classStudent({ student_id: 56, name: "Marta", last_name: "Prieto", attendance: "present" }),
  ],
});

describe("PreviousClassCard", () => {
  it("como el prototipo: título, día, asistencia, sus alumnos y cuántos eran", () => {
    render(<PreviousClassCard item={previous} onPress={jest.fn()} />);

    expect(screen.getByText("Cantera Intermedios", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Lun 14 sept", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Asistencia 2/3", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("3 alumnos", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getAllByTestId("student-avatar", { includeHiddenElements: true })).toHaveLength(3);
  });

  it("se lee de una vez y, al tocarla, abre su lista", () => {
    const onPress = jest.fn();
    render(<PreviousClassCard item={previous} onPress={onPress} />);

    fireEvent.press(
      screen.getByRole("button", { name: "Cantera Intermedios, Lun 14 sept, Asistencia 2/3, 3 alumnos" }),
    );

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("con un solo alumno, en singular", () => {
    render(<PreviousClassCard item={scheduleClass({ students: [classStudent()] })} onPress={jest.fn()} />);

    expect(screen.getByText("1 alumno", { includeHiddenElements: true })).toBeTruthy();
  });
});
