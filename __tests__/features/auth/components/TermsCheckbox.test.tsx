import { fireEvent, render, screen } from "@testing-library/react-native";

import { TermsCheckbox } from "@/features/auth/components/TermsCheckbox";

describe("TermsCheckbox", () => {
  it("marcar la casilla avisa con true", () => {
    const onChange = jest.fn();
    render(<TermsCheckbox checked={false} onChange={onChange} />);

    fireEvent.press(
      screen.getByRole("checkbox", {
        name: "Al registrarte aceptas nuestras condiciones de uso y políticas de privacidad",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("los enlaces abren el resumen sin marcar la casilla", () => {
    const onChange = jest.fn();
    render(<TermsCheckbox checked={false} onChange={onChange} />);

    fireEvent.press(screen.getByText("condiciones de uso"));
    expect(screen.getByText("Términos y Condiciones")).toBeTruthy();

    fireEvent.press(screen.getAllByRole("button", { name: "Cerrar" })[0]);
    fireEvent.press(screen.getByText("políticas de privacidad"));
    expect(screen.getByText("Política de Privacidad")).toBeTruthy();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("muestra el error", () => {
    render(
      <TermsCheckbox checked={false} onChange={jest.fn()} error="Debes aceptar los términos y condiciones" />,
    );

    expect(screen.getByText("Debes aceptar los términos y condiciones")).toBeTruthy();
  });
});
