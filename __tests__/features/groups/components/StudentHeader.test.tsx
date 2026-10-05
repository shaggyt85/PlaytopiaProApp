import { render, screen } from "@testing-library/react-native";

import { StudentHeader } from "@/features/groups/components/StudentHeader";

import { classStudent } from "../../../helpers/scheduleFactories";

describe("StudentHeader", () => {
  it("su nombre y su nivel en la sede, en su pastilla", () => {
    render(<StudentHeader student={classStudent({ level: 2.5 })} index={0} onBack={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Lucía Romero" })).toBeTruthy();
    expect(screen.getByLabelText("Nivel 2,5")).toBeTruthy();
    expect(screen.getByTestId("student-level")).toBeTruthy();
  });

  it("sin matrícula en la sede no tiene nivel, y no se enseña", () => {
    render(<StudentHeader student={classStudent({ level: null })} index={0} onBack={jest.fn()} />);

    expect(screen.queryByTestId("student-level")).toBeNull();
  });
});
