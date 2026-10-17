import { fireEvent, render, screen } from "@testing-library/react-native";

import { CloseButton } from "@/shared/components/CloseButton";

describe("CloseButton", () => {
  it("es la X «Cerrar» y cierra al tocarla", () => {
    const onPress = jest.fn();
    render(<CloseButton onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("en la esquina de su panel, y más abajo si se le pide (el panel lateral, bajo la barra de estado)", () => {
    const { rerender, toJSON } = render(<CloseButton onPress={jest.fn()} corner />);
    expect(toJSON()).toHaveStyle({ position: "absolute", top: 16, right: 16 });

    rerender(<CloseButton onPress={jest.fn()} corner extraTop={40} />);
    expect(toJSON()).toHaveStyle({ top: 56 });
  });
});
