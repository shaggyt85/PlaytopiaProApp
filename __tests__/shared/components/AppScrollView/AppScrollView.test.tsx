import { render, screen } from "@testing-library/react-native";
import { ScrollView, Text } from "react-native";

import { AppScrollView } from "@/shared/components/AppScrollView";

describe("AppScrollView", () => {
  it("sin barra de desplazamiento: es un móvil", () => {
    render(
      <AppScrollView>
        <Text>Contenido</Text>
      </AppScrollView>,
    );

    expect(screen.UNSAFE_getByType(ScrollView).props.showsVerticalScrollIndicator).toBe(false);
  });

  it("lo demás pasa tal cual al ScrollView", () => {
    render(
      <AppScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 4 }}>
        <Text>Contenido</Text>
      </AppScrollView>,
    );

    const { props } = screen.UNSAFE_getByType(ScrollView);
    expect(props.keyboardShouldPersistTaps).toBe("handled");
    expect(props.contentContainerStyle).toEqual({ padding: 4 });
    expect(screen.getByText("Contenido")).toBeTruthy();
  });
});
