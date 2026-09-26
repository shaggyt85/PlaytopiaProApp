import { fireEvent, render, screen } from "@testing-library/react-native";

import { GenderSelector } from "@/shared/components/GenderSelector";
import { GENDER } from "@/shared/config/gender";

describe("GenderSelector", () => {
  it("pinta un botón por opción y marca el elegido", () => {
    render(<GenderSelector value={GENDER.FEMALE} onChange={jest.fn()} />);

    expect(screen.getByRole("radio", { name: "Masculino", selected: false })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Femenino", selected: true })).toBeTruthy();
  });

  it("elegir una opción avisa con su valor de Core", () => {
    const onChange = jest.fn();
    render(<GenderSelector value={GENDER.NONE} onChange={onChange} />);

    fireEvent.press(screen.getByRole("radio", { name: "Femenino" }));

    expect(onChange).toHaveBeenCalledWith(GENDER.FEMALE);
  });

  it("'Prefiero no decirlo' está marcada cuando el valor es no lo dice", () => {
    render(<GenderSelector value={GENDER.NONE} onChange={jest.fn()} />);

    expect(screen.getByRole("checkbox", { checked: true })).toBeTruthy();
  });

  it("marcar 'Prefiero no decirlo' pasa a no lo dice", () => {
    const onChange = jest.fn();
    render(<GenderSelector value={GENDER.MALE} onChange={onChange} />);

    fireEvent.press(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(GENDER.NONE);
  });

  it("desmarcarla vuelve a masculino, como en la app de alumnos", () => {
    const onChange = jest.fn();
    render(<GenderSelector value={GENDER.NONE} onChange={onChange} />);

    fireEvent.press(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(GENDER.MALE);
  });

  it("muestra el error", () => {
    render(<GenderSelector value={GENDER.NONE} onChange={jest.fn()} error="Elige una opción" />);

    expect(screen.getByText("Elige una opción")).toBeTruthy();
  });
});
