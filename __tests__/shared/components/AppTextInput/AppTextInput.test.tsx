import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { AppTextInput } from "@/shared/components/AppTextInput";
import { darkTheme } from "@/shared/config/theme";

describe("AppTextInput", () => {
  it("lleva el color del texto, del ejemplo y de la selección, y la letra de los campos", () => {
    render(<AppTextInput placeholder="Escribe" testID="campo" />);
    const input = screen.getByTestId("campo");

    expect(input.props.placeholderTextColor).toBe(darkTheme.colors.textSecondary);
    expect(input.props.selectionColor).toBe(darkTheme.colors.primary);
    expect(StyleSheet.flatten(input.props.style)).toMatchObject({ ...darkTheme.typography.input, color: darkTheme.colors.text });
  });

  it("cada campo puede poner su forma y su letra encima", () => {
    render(<AppTextInput testID="campo" style={darkTheme.typography.caption} />);

    expect(StyleSheet.flatten(screen.getByTestId("campo").props.style)).toMatchObject(darkTheme.typography.caption);
  });
});
