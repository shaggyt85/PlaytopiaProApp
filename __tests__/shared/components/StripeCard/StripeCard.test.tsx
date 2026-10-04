import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { StripeCard } from "@/shared/components/StripeCard";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const styleOf = () => StyleSheet.flatten(screen.getByTestId("card").props.style);

describe("StripeCard", () => {
  beforeEach(() => mockGradient.mockClear());

  it("la caja: recorta, borde fino, fondo `surface` y radio `xxxl` por defecto", () => {
    render(
      <StripeCard stripe={darkTheme.gradients.brand} testID="card">
        <Text>contenido</Text>
      </StripeCard>,
    );

    expect(screen.getByText("contenido")).toBeTruthy();
    expect(styleOf()).toMatchObject({
      overflow: "hidden",
      ...darkTheme.ringSoft,
      backgroundColor: darkTheme.colors.surface,
      borderRadius: darkTheme.radius.xxxl,
    });
  });

  it("la franja vertical de 6 a la izquierda, con sus colores de arriba abajo", () => {
    render(
      <StripeCard stripe={darkTheme.clubColors[2].gradient} testID="card">
        <Text>contenido</Text>
      </StripeCard>,
    );

    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: darkTheme.clubColors[2].gradient,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        style: expect.objectContaining({ left: 0, width: 6 }),
      }),
    );
  });

  it("con otro radio", () => {
    render(
      <StripeCard stripe={darkTheme.gradients.brand} radius="lg" testID="card">
        <Text>contenido</Text>
      </StripeCard>,
    );

    expect(styleOf().borderRadius).toBe(darkTheme.radius.lg);
  });
});
