import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { FormField } from "@/shared/components/FormField";

describe("FormField", () => {
  it("la etiqueta, el campo y su error debajo", () => {
    render(
      <FormField label="Nombre" error="Escribe tu nombre">
        <Text>campo</Text>
      </FormField>,
    );

    expect(screen.getByText("Nombre")).toBeTruthy();
    expect(screen.getByText("campo")).toBeTruthy();
    expect(screen.getByText("Escribe tu nombre")).toBeTruthy();
  });

  it("obligatorio, con su asterisco; sin error ni etiqueta, solo el campo", () => {
    const { rerender } = render(
      <FormField label="Nacimiento" required>
        <Text>campo</Text>
      </FormField>,
    );
    expect(screen.getByText(/\*/)).toBeTruthy();

    rerender(
      <FormField>
        <Text>campo</Text>
      </FormField>,
    );
    expect(screen.queryByText("Nacimiento")).toBeNull();
    expect(screen.getByText("campo")).toBeTruthy();
  });
});
