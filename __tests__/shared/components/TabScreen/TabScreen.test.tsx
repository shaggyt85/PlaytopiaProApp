import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { TabScreen } from "@/shared/components/TabScreen";

describe("TabScreen", () => {
  it("enmarca el contenido de la pestaña", () => {
    render(
      <TabScreen testID="pestana">
        <Text>Contenido</Text>
      </TabScreen>,
    );

    expect(screen.getByTestId("pestana")).toBeTruthy();
    expect(screen.getByText("Contenido")).toBeTruthy();
  });
});
