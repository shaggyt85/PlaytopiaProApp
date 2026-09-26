import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ScreenHeader } from "@/shared/components/ScreenHeader";

describe("ScreenHeader", () => {
  it("pinta saludo, título, subtítulo y lo de la derecha", () => {
    render(
      <ScreenHeader greeting="Buenos días" title="David" subtitle="Viernes" right={<Text>campana</Text>} />,
    );

    expect(screen.getByText("Buenos días")).toBeTruthy();
    expect(screen.getByRole("header", { name: "David" })).toBeTruthy();
    expect(screen.getByText("Viernes")).toBeTruthy();
    expect(screen.getByText("campana")).toBeTruthy();
  });

  it("sin título reserva su hueco para que nada salte al llegar", () => {
    render(<ScreenHeader greeting="Buenos días" />);

    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByTestId("screen-header-title-placeholder")).toBeTruthy();
  });
});
