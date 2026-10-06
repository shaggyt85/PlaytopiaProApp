import { render, screen } from "@testing-library/react-native";

import { EmailInput } from "@/shared/components/EmailInput";

describe("EmailInput", () => {
  it("trae la etiqueta, el teclado, el autocompletado y el tope de un email", () => {
    render(<EmailInput />);
    const campo = screen.getByLabelText("Correo electrónico");

    expect(campo.props).toMatchObject({
      placeholder: "tu@correo.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoCorrect: false,
      autoComplete: "email",
      textContentType: "emailAddress",
      maxLength: 254,
    });
  });

  it("lo que manda la pantalla se respeta, y puede cambiar la etiqueta", () => {
    render(<EmailInput label="Tu email" returnKeyType="send" />);

    expect(screen.getByLabelText("Tu email").props.returnKeyType).toBe("send");
  });
});
