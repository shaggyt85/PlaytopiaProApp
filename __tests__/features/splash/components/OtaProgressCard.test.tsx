import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { OtaProgressCard } from "@/features/splash/components/OtaProgressCard";

describe("OtaProgressCard", () => {
  it("dice que se está actualizando y cuánto lleva", () => {
    render(<OtaProgressCard progress={0.42} />);

    expect(screen.getByText("Actualizando Playtopia Pro")).toBeTruthy();
    expect(screen.getByText("Entrarás en cuanto termine")).toBeTruthy();
    expect(screen.getByText("42 %")).toBeTruthy();
    expect(screen.getByTestId("ota-progress-card").props.accessibilityValue).toEqual({ min: 0, max: 100, now: 42 });
  });

  it("la barra se llena con el progreso", () => {
    render(<OtaProgressCard progress={0.75} />);

    expect(StyleSheet.flatten(screen.getByTestId("ota-progress-fill").props.style).width).toBe("75%");
  });

  it("no se sale de 0 a 100 aunque llegue un valor raro", () => {
    render(<OtaProgressCard progress={1.4} />);

    expect(screen.getByText("100 %")).toBeTruthy();
  });
});
