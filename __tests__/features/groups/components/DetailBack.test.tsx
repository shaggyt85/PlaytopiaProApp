import { fireEvent, render, screen } from "@testing-library/react-native";

import { DetailBack } from "@/features/groups/components/DetailBack";

describe("DetailBack", () => {
  it("la ‹ de las pantallas de grupos: «Volver»", () => {
    const onPress = jest.fn();
    render(<DetailBack onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Volver" }));

    expect(onPress).toHaveBeenCalled();
  });
});
