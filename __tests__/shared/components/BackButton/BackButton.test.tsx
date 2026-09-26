import { fireEvent, render, screen } from "@testing-library/react-native";

import { BackButton } from "@/shared/components/BackButton";

const mockBack = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack }) }));

describe("BackButton", () => {
  it("por defecto vuelve a la pantalla anterior", () => {
    render(<BackButton />);

    fireEvent.press(screen.getByRole("button", { name: "Volver" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("acepta una acción propia", () => {
    const onPress = jest.fn();
    render(<BackButton onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Volver" }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });
});
