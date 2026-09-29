import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { TimeSquare } from "@/features/schedule/components/TimeSquare";
import { darkTheme } from "@/shared/config/theme";

describe("TimeSquare", () => {
  it("la hora con dos cifras, en un cuadrado redondo del lado que se le pide", () => {
    render(<TimeSquare time="08:30:00" colors={darkTheme.clubColors[2]} size={56} />);

    expect(screen.getByText("08:30")).toBeTruthy();
    const square = StyleSheet.flatten(screen.getByTestId("time-square").props.style);
    expect(square).toMatchObject({ width: 56, height: 56, borderRadius: 28 });
  });
});
