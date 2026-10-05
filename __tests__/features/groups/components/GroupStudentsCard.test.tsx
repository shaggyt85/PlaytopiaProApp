import { render, screen } from "@testing-library/react-native";

import { GroupStudentsCard } from "@/features/groups/components/GroupStudentsCard";

import { classStudent } from "../../../helpers/scheduleFactories";

describe("GroupStudentsCard", () => {
  it("«Alumnos del grupo»: cada uno con su nombre y su nivel, como lista", () => {
    render(
      <GroupStudentsCard
        students={[classStudent({ student_id: 54, name: "Diego", last_name: "Pérez", level: 2.5 }), classStudent({ level: 2 })]}
      />,
    );

    expect(screen.getByRole("header", { name: "Alumnos del grupo" })).toBeTruthy();
    expect(screen.getByLabelText("Diego Pérez, Nivel 2,5")).toBeTruthy();
    expect(screen.getByLabelText("Lucía Romero, Nivel 2,0")).toBeTruthy();
    expect(screen.getAllByTestId("group-student")).toHaveLength(2);
  });

  it("sin matrícula en la sede, sin nivel", () => {
    render(<GroupStudentsCard students={[classStudent({ level: null })]} />);

    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
  });

  it("sin alumnos, «Aún no hay alumnos apuntados»", () => {
    render(<GroupStudentsCard students={[]} />);

    expect(screen.getByText("Aún no hay alumnos apuntados")).toBeTruthy();
  });
});
