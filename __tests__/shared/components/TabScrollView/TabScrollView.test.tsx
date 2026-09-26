import { render, screen } from "@testing-library/react-native";
import { ScrollView, Text } from "react-native";

import { TabScrollView } from "@/shared/components/TabScrollView";
import { TAB_BAR_HEIGHT } from "@/shared/components/TabBar";

describe("TabScrollView", () => {
  it("lleva el logo de Playtopia arriba (como imagen, no como título) y el contenido debajo", () => {
    render(
      <TabScrollView>
        <Text>Contenido</Text>
      </TabScrollView>,
    );

    expect(screen.getByRole("image", { name: "Playtopia" })).toBeTruthy();
    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByText("Contenido")).toBeTruthy();
  });

  it("deja abajo el hueco de la barra flotante", () => {
    render(
      <TabScrollView>
        <Text>Contenido</Text>
      </TabScrollView>,
    );

    const { contentContainerStyle } = screen.UNSAFE_getByType(ScrollView).props;
    const paddingBottom = [contentContainerStyle].flat().find((s) => s?.paddingBottom)?.paddingBottom;
    expect(paddingBottom).toBeGreaterThanOrEqual(TAB_BAR_HEIGHT);
  });
});
