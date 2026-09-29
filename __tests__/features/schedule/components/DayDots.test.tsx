import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";

import { DayDots } from "@/features/schedule/components/DayDots";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

const dotColor = (index: number) => {
  const dot = screen.getByTestId("day-dots").children[index] as ReactTestInstance;
  return StyleSheet.flatten(dot.props.style).backgroundColor;
};

describe("DayDots", () => {
  it("un punto por color, cada uno del suyo", () => {
    render(<DayDots colors={["#111111", "#222222"]} onBrand={false} />);

    expect(screen.getByTestId("day-dots").children).toHaveLength(2);
    expect(dotColor(1)).toBe("#222222");
  });

  it("sobre el degradado del elegido, blancos al 80 %", () => {
    render(<DayDots colors={["#111111"]} onBrand />);

    expect(dotColor(0)).toBe(withAlpha(darkTheme.colors.onPrimary, 0.8));
  });

  it("sin clases, el hueco sin puntos", () => {
    render(<DayDots colors={[]} onBrand={false} />);

    expect(screen.getByTestId("day-dots").children).toHaveLength(0);
  });
});
