import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { Button } from "@/shared/components/Button";

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
});
