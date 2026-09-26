import { render, screen } from "@testing-library/react-native";

import { Text } from "@/shared/components/Text";
import { darkTheme } from "@/shared/config/theme";

describe("Text", () => {
  it("usa la tipografía de la variante y el color del tema", () => {
    render(
      <Text variant="title" color="danger" align="center">
        Hola
      </Text>,
    );

    expect(screen.getByText("Hola")).toHaveStyle({
      fontSize: darkTheme.typography.title.fontSize,
      color: darkTheme.colors.danger,
      textAlign: "center",
    });
  });

  it("por defecto es body y color de texto", () => {
    render(<Text>Normal</Text>);

    expect(screen.getByText("Normal")).toHaveStyle({
      fontSize: darkTheme.typography.body.fontSize,
      color: darkTheme.colors.text,
    });
  });
});
