import { fireEvent, render, screen } from "@testing-library/react-native";

import { EditButton } from "@/features/profile/components/EditButton";

describe("EditButton", () => {
  it("«Editar», con lo que edita para el lector de pantalla", () => {
    const onPress = jest.fn();
    render(<EditButton onPress={onPress} accessibilityLabel="Editar datos personales" />);

    fireEvent.press(screen.getByRole("button", { name: "Editar datos personales" }));

    expect(screen.getByText("Editar")).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
