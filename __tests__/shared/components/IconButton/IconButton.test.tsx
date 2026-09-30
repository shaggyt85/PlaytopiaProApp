import { IconLoBell } from "@playtopia/icons/react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { IconButton } from "@/shared/components/IconButton";
import { darkTheme } from "@/shared/config/theme";

describe("IconButton", () => {
  it("es un botón con su etiqueta y avisa al pulsarlo", () => {
    const onPress = jest.fn();
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Notificaciones" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Notificaciones" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("sin acción queda desactivado: el lector lo anuncia así", () => {
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Notificaciones" />);

    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeDisabled();
  });

  it("con acción está activo", () => {
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Notificaciones" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeEnabled();
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

describe("IconButton sobre un color", () => {
  it("sin borde y con el icono en blanco", () => {
    render(<IconButton Icon={IconLoBell} accessibilityLabel="Volver" variant="onColor" onPress={jest.fn()} />);

    const style = StyleSheet.flatten(screen.getByRole("button", { name: "Volver" }).props.style);
    expect(style.borderWidth).toBeUndefined();
    expect(style.backgroundColor).not.toBe(darkTheme.colors.surfaceStrong);
  });
});
