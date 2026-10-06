import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { MeterBar } from "@/shared/components/MeterBar";
import { METER_HEIGHTS } from "@/shared/components/MeterBar/MeterBar.styles";
import { darkTheme } from "@/shared/config/theme";

const BRAND = darkTheme.gradients.brand;
// La barra es decorativa (oculta al lector de pantalla): se busca también entre lo oculto.
const bar = () => screen.getByTestId("bar", { includeHiddenElements: true });
const widthOf = () => StyleSheet.flatten(bar().props.style).width;

describe("MeterBar", () => {
  it("llena su proporción con el degradado que se le da", () => {
    render(<MeterBar value={0.75} colors={BRAND} testID="bar" />);

    expect(widthOf()).toBe("75%");
    expect(screen.UNSAFE_root.findAll((n) => n.props.colors === BRAND).length).toBeGreaterThan(0);
  });

  it.each([
    [-0.2, "0%"],
    [1.4, "100%"],
  ])("lo que se sale de 0–1 se recorta (%d → %s)", (value, width) => {
    render(<MeterBar value={value} colors={BRAND} testID="bar" />);

    expect(widthOf()).toBe(width);
  });

  it.each(["sm", "md"] as const)("su alto %s es el de METER_HEIGHTS", (size) => {
    render(<MeterBar value={0.5} colors={BRAND} size={size} testID="bar" />);

    const track = bar().parent?.parent;
    expect(StyleSheet.flatten(track?.props.style).height).toBe(METER_HEIGHTS[size]);
  });
});
