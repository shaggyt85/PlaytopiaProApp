import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { DetailSection } from "@/features/schedule/components/DetailSection";

describe("DetailSection", () => {
  it("su título y, debajo, su contenido", () => {
    render(
      <DetailSection title="Alumnos">
        <Text>Lucía Romero</Text>
      </DetailSection>,
    );

    expect(screen.getByRole("header", { name: "Alumnos" })).toBeTruthy();
    expect(screen.getByText("Lucía Romero")).toBeTruthy();
  });

  it("a la derecha del título, lo que se le pase", () => {
    render(
      <DetailSection title="Alumnos y asistencia" aside={<Text>2/4 presentes</Text>}>
        <Text>Lucía Romero</Text>
      </DetailSection>,
    );

    expect(screen.getByText("2/4 presentes")).toBeTruthy();
  });
});
