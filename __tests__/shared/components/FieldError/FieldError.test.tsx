import { render, screen } from "@testing-library/react-native";

import { FieldError } from "@/shared/components/FieldError";

describe("FieldError", () => {
  it("muestra el mensaje", () => {
    render(<FieldError message="El nombre debe tener al menos 2 caracteres" />);

    expect(screen.getByText("El nombre debe tener al menos 2 caracteres")).toBeTruthy();
  });

  it.each([undefined, null, ""])("sin mensaje (%s) no pinta nada", (message) => {
    const { toJSON } = render(<FieldError message={message} />);

    expect(toJSON()).toBeNull();
  });
});
