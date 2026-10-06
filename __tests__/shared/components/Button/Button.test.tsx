import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { Button } from "@/shared/components/Button";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

describe("Button", () => {
  it("llama a onPress al pulsar", () => {
    const onPress = jest.fn();
    render(<Button title="Guardar" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("mientras la promesa de onPress no termina, ignora más toques", async () => {
    let resolve!: () => void;
    const onPress = jest.fn(() => new Promise<void>((r) => (resolve = r)));
    render(<Button title="Enviar" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button"));
    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toBeBusy();
    expect(screen.getByTestId("button-loading")).toBeTruthy();

    await act(async () => resolve());

    expect(screen.getByRole("button")).not.toBeBusy();
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("con loading no se puede pulsar y se anuncia como ocupado", () => {
    const onPress = jest.fn();
    render(<Button title="Enviar" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeBusy();
  });

  it("deshabilitado no responde", () => {
    const onPress = jest.fn();
    render(<Button title="Enviar" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("danger pinta su icono y su texto en el color de peligro", () => {
    const Icon = jest.fn(() => null);
    render(<Button title="Cerrar sesión" variant="danger" Icon={Icon} onPress={jest.fn()} />);

    expect(screen.getByText("Cerrar sesión")).toBeTruthy();
    expect(Icon).toHaveBeenCalledWith(expect.objectContaining({ size: 16, color: darkTheme.colors.danger }), undefined);
  });

  it("dangerOutline es la de danger con el borde rojo suave, como «Borrar cuenta» del prototipo", () => {
    render(<Button title="Borrar cuenta" variant="dangerOutline" onPress={jest.fn()} />);

    expect(screen.getByText("Borrar cuenta")).toHaveStyle({ color: darkTheme.colors.danger });
    const button = screen.getByRole("button");
    // El cuerpo del botón: la primera vista dentro de lo que se pulsa.
    const body = button.findAll((node) => (node.type as unknown) === "View" && node !== button)[0];
    expect(body).toHaveStyle({
      backgroundColor: darkTheme.colors.card,
      borderColor: withAlpha(darkTheme.colors.danger, 0.3),
    });
  });
});
