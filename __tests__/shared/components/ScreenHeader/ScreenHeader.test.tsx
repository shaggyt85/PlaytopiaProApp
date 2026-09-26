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

  it("mientras carga el título reserva su hueco para que nada salte al llegar", () => {
    render(<ScreenHeader greeting="Buenos días" loading />);

    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByTestId("screen-header-title-placeholder")).toBeTruthy();
  });

  it("sin título y sin cargar no deja hueco", () => {
    render(<ScreenHeader greeting="Buenos días" subtitle="Viernes" />);

    expect(screen.queryByTestId("screen-header-title-placeholder")).toBeNull();
    expect(screen.getByText("Viernes")).toBeTruthy();
  });

  it("un título largo puede ocupar dos líneas antes de cortarse", () => {
    render(<ScreenHeader title="María de los Ángeles" />);

    expect(screen.getByRole("header").props.numberOfLines).toBe(2);
  });
});
