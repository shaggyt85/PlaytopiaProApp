import { fireEvent, render, screen } from "@testing-library/react-native";
import { BlurView } from "expo-blur";
import { BackHandler, Text } from "react-native";

import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";
import { BottomSheet } from "@/shared/components/BottomSheet";

describe("BottomSheet", () => {
  it("cerrado no pinta nada", () => {
    render(
      <BottomSheet visible={false} onClose={jest.fn()}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText("Contenido")).toBeNull();
  });

  it("abierto pinta su contenido", () => {
    render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );

    expect(screen.getByText("Contenido")).toBeTruthy();
  });

  it("se cierra con la X y tocando fuera", () => {
    const onClose = jest.fn();
    render(
      <BottomSheet visible onClose={onClose}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );

    // El fondo queda oculto al lector de pantalla (el panel es modal): allí se cierra con la X.
    fireEvent.press(screen.getByTestId("bottom-sheet-backdrop", { includeHiddenElements: true }));
    fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("el botón atrás de Android lo cierra solo mientras está abierto", () => {
    const remove = jest.fn();
    const addListener = jest.spyOn(BackHandler, "addEventListener").mockReturnValue({ remove });
    const onClose = jest.fn();
    const { rerender } = render(
      <BottomSheet visible onClose={onClose}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );

    const [event, handler] = addListener.mock.calls[0];
    expect(event).toBe("hardwareBackPress");
    expect(handler()).toBe(true);
    expect(onClose).toHaveBeenCalled();

    rerender(
      <BottomSheet visible={false} onClose={onClose}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );
    expect(remove).toHaveBeenCalled();
    addListener.mockRestore();
  });

  it("desenfoca el contenido del BlurTarget, que queda fuera del panel", () => {
    render(
      <BlurTargetProvider>
        <BlurTarget>
          <Text>Pantalla</Text>
        </BlurTarget>
        <BottomSheet visible onClose={jest.fn()}>
          <Text>Contenido</Text>
        </BottomSheet>
      </BlurTargetProvider>,
    );

    const blur = screen.UNSAFE_getByType(BlurView);
    expect(blur.props.blurTarget.current).toBeTruthy();
    expect(blur.props.blurMethod).toBe("dimezisBlurViewSdk31Plus");
  });

  it("fuera de un BlurTargetProvider el desenfoque no tiene objetivo", () => {
    render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Contenido</Text>
      </BottomSheet>,
    );

    expect(screen.UNSAFE_getByType(BlurView).props.blurTarget).toBeUndefined();
  });
});
