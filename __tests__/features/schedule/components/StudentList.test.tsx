import { render, screen } from "@testing-library/react-native";

import { StudentList } from "@/features/schedule/components/StudentList";

const students = [
  { name: "Diego", last_name: "Pérez" },
  { name: "Lucía", last_name: "Romero" },
];

describe("StudentList", () => {
  it("una fila por alumno con su nombre, como lista para el lector de pantalla", () => {
    render(<StudentList students={students} />);

    expect(screen.getByTestId("student-list").props.accessibilityRole).toBe("list");
    expect(screen.getAllByTestId("student-row")).toHaveLength(2);
    expect(screen.getByLabelText("Diego Pérez")).toBeTruthy();
    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
  });

  it("sin alumnos, «Aún no hay alumnos apuntados»", () => {
    render(<StudentList students={[]} />);

    expect(screen.getByText("Aún no hay alumnos apuntados")).toBeTruthy();
    expect(screen.queryByTestId("student-list")).toBeNull();
  });
});
