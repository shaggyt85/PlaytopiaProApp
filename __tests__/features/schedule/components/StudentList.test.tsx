import { render, screen } from "@testing-library/react-native";

import { StudentList } from "@/features/schedule/components/StudentList";

import { classStudent } from "../../../helpers/scheduleFactories";

const students = [
  classStudent({ student_id: 54, name: "Diego", last_name: "Pérez", level: null }),
  classStudent({ level: null }),
];

describe("StudentList", () => {
  it("una fila por alumno con su nombre, como lista para el lector de pantalla", () => {
    render(<StudentList students={students} attendance="notYet" onMark={jest.fn()} />);

    expect(screen.getByTestId("student-list").props.accessibilityRole).toBe("list");
    expect(screen.getAllByTestId("student-row")).toHaveLength(2);
    expect(screen.getByLabelText("Diego Pérez")).toBeTruthy();
    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
  });

  it("con la asistencia abierta, cada fila con sus botones", () => {
    render(<StudentList students={students} attendance="open" onMark={jest.fn()} />);

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("sin alumnos, «Aún no hay alumnos apuntados»", () => {
    render(<StudentList students={[]} attendance="open" onMark={jest.fn()} />);

    expect(screen.getByText("Aún no hay alumnos apuntados")).toBeTruthy();
    expect(screen.queryByTestId("student-list")).toBeNull();
  });
});
