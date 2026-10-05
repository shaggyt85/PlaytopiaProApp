import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { IconText } from "@/shared/components/IconText";
import { darkTheme } from "@/shared/config/theme";

const Icon = jest.fn((_props: { size?: number; color?: string }) => null);
const iconProps = () => Icon.mock.calls.at(-1)?.[0];

describe("IconText", () => {
  beforeEach(() => Icon.mockClear());

  it("por defecto, la línea de datos: icono de 12 y texto `meta`, los dos en gris", () => {
    render(<IconText Icon={Icon} label="Calle Mayor 1" />);

    expect(iconProps()).toEqual({ size: 12, color: darkTheme.colors.textSecondary });
    expect(StyleSheet.flatten(screen.getByText("Calle Mayor 1").props.style)).toMatchObject({
      fontSize: darkTheme.typography.meta.fontSize,
      color: darkTheme.colors.textSecondary,
    });
  });

  it("el icono puede ir en otro color que el texto (la tarjeta de arriba, en magenta)", () => {
    render(<IconText Icon={Icon} label="Pista 1" size="card" iconColor="primary" />);

    expect(iconProps()).toEqual({ size: 14, color: darkTheme.colors.primary });
    expect(StyleSheet.flatten(screen.getByText("Pista 1").props.style).fontSize).toBe(darkTheme.typography.caption.fontSize);
  });

  it("el icono puede ir en un color que no es del tema (el de un grupo)", () => {
    render(<IconText Icon={Icon} label="Pista 1" size="card" iconColor="primary" iconTint="#00B0FF" />);

    expect(iconProps()?.color).toBe("#00B0FF");
  });

  it("sobre un color, todo en blanco y en seminegrita, como la cabecera del detalle", () => {
    render(<IconText Icon={Icon} label="Pista 1" size="hero" color="onPrimary" />);

    expect(iconProps()?.color).toBe(darkTheme.colors.onPrimary);
    const style = StyleSheet.flatten(screen.getByText("Pista 1").props.style);
    expect(style.color).toBe(darkTheme.colors.onPrimary);
    expect(style.fontFamily).toBe(darkTheme.typography.labelStrong.fontFamily);
  });

  it("si no cabe, se encoge el texto y se corta en las líneas que se le digan", () => {
    render(<IconText Icon={Icon} label="Una dirección muy larga" numberOfLines={1} />);

    const text = screen.getByText("Una dirección muy larga");
    expect(text.props.numberOfLines).toBe(1);
    expect(StyleSheet.flatten(text.props.style).flexShrink).toBe(1);
  });
});
