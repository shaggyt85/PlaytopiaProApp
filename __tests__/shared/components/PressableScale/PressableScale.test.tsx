import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { PressableScale } from "@/shared/components/PressableScale";

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

  it("un desplegable dice si está abierto; lo demás no dice nada de eso", () => {
    const { rerender } = render(
      <PressableScale onPress={jest.fn()} accessibilityLabel="Historial de horas" expanded={false}>
        <Text>Historial de horas</Text>
      </PressableScale>,
    );
    expect(screen.getByRole("button", { name: "Historial de horas", expanded: false })).toBeTruthy();

    rerender(
      <PressableScale onPress={jest.fn()} accessibilityLabel="Historial de horas" expanded>
        <Text>Historial de horas</Text>
      </PressableScale>,
    );
    expect(screen.getByRole("button", { name: "Historial de horas", expanded: true })).toBeTruthy();

    rerender(
      <PressableScale onPress={jest.fn()} accessibilityLabel="Cantera Tarde">
        <Text>Cantera Tarde</Text>
      </PressableScale>,
    );
    expect(screen.getByRole("button").props.accessibilityState?.expanded).toBeUndefined();
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
