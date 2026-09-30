import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { GradientSquare } from "@/features/schedule/components/GradientSquare";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

describe("GradientSquare", () => {
  it("un cuadrado del lado pedido con el degradado del club y lo de dentro", () => {
    render(
      <GradientSquare colors={darkTheme.clubColors[2]} size={48} testID="square">
        <Text>dentro</Text>
      </GradientSquare>,
    );

    expect(screen.getByText("dentro")).toBeTruthy();
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.clubColors[2].gradient }));
    // El radio del prototipo no pasa de la mitad del lado.
    expect(StyleSheet.flatten(screen.getByTestId("square").props.style)).toMatchObject({
      width: 48,
      height: 48,
      borderRadius: 24,
    });
  });
});
