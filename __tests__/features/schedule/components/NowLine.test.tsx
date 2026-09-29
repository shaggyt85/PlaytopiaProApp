import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { NowLine } from "@/features/schedule/components/NowLine";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

const hidden = { includeHiddenElements: true };

describe("NowLine", () => {
  it("a su altura, con la hora de ahora y oculta al lector de pantalla", () => {
    render(<NowLine top={96} wallMs={wallAsUtcMs("2026-10-05", "09:30:00")} />);

    expect(screen.queryByTestId("now-line")).toBeNull();
    expect(StyleSheet.flatten(screen.getByTestId("now-line", hidden).props.style).top).toBe(96);
    expect(screen.getByText("09:30", hidden)).toBeTruthy();
  });

  it("sin zIndex: se desmonta cuando el día no es hoy, y en Android eso cerraría la app", () => {
    render(<NowLine top={0} wallMs={wallAsUtcMs("2026-10-05", "09:30:00")} />);

    expect(StyleSheet.flatten(screen.getByTestId("now-line", hidden).props.style).zIndex).toBeUndefined();
  });
});
