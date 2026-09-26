import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { TabScreen } from "@/shared/components/TabScreen";

describe("TabScreen", () => {
  it("lleva el logo de Playtopia arriba y el contenido debajo", () => {
    render(
      <TabScreen testID="pestana">
        <Text>Contenido</Text>
      </TabScreen>,
    );

    expect(screen.getByTestId("pestana")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Playtopia" })).toBeTruthy();
    expect(screen.getByText("Contenido")).toBeTruthy();
  });
});
