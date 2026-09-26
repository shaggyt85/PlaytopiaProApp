import { IconLoBell } from "@playtopia/icons/react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { IconButton } from "@/shared/components/IconButton";
import { darkTheme } from "@/shared/config/theme";

describe("IconButton", () => {
  it("es un botón con su etiqueta y avisa al pulsarlo", () => {
    const onPress = jest.fn();
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Notificaciones" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Notificaciones" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("por defecto mide el área táctil mínima", () => {
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Notificaciones" />);

    expect(screen.getByRole("button")).toHaveStyle({
      width: darkTheme.touchTarget,
      height: darkTheme.touchTarget,
    });
  });

  it("más pequeño, completa el área táctil con hitSlop", () => {
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Cerrar" size={36} />);

    expect(screen.getByRole("button")).toHaveStyle({ width: 36 });
    expect(screen.getByRole("button").props.hitSlop).toBe((darkTheme.touchTarget - 36) / 2);
  });
});
