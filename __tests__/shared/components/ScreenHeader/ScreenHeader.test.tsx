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

  it("pinta lo de la izquierda antes de los textos y lo centra en vertical", () => {
    render(<ScreenHeader title="David" left={<Text>avatar</Text>} right={<Text>campana</Text>} />);

    const texts = screen.UNSAFE_root.findAllByType(Text).map((t) => t.props.children);
    expect(texts.indexOf("avatar")).toBeLessThan(texts.indexOf("David"));
    expect(screen.getByTestId("screen-header")).toHaveStyle({ alignItems: "center" });
  });

  it("sin nada a la izquierda, los textos van arriba como siempre", () => {
    render(<ScreenHeader title="David" right={<Text>campana</Text>} />);

    expect(screen.getByTestId("screen-header")).toHaveStyle({ alignItems: "flex-start" });
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
