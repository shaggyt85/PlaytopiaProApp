import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { PressableScale } from "@/features/schedule/components/PressableScale";

describe("PressableScale", () => {
  it("es un botón con su etiqueta y su pista, y al tocarlo avisa", () => {
    const onPress = jest.fn();
    render(
      <PressableScale onPress={onPress} accessibilityLabel="Cantera Tarde" accessibilityHint="Abre el detalle">
        <Text>Cantera Tarde</Text>
      </PressableScale>,
    );

    const button = screen.getByRole("button", { name: "Cantera Tarde" });
    expect(button.props.accessibilityHint).toBe("Abre el detalle");
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("el estilo y el testID van en la caja que se encoge; tocarla también avisa", () => {
    const onPress = jest.fn();
    render(
      <PressableScale onPress={onPress} accessibilityLabel="x" style={{ opacity: 0.5 }} testID="box">
        <Text>x</Text>
      </PressableScale>,
    );

    expect(StyleSheet.flatten(screen.getByTestId("box").props.style).opacity).toBe(0.5);
    fireEvent.press(screen.getByTestId("box"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
