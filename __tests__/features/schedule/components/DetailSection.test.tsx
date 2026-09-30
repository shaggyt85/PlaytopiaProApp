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
});
