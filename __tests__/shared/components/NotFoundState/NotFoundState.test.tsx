import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { NotFoundState } from "@/shared/components/NotFoundState";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

const router = { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) };

describe("NotFoundState", () => {
  beforeEach(() => jest.mocked(useRouter).mockReturnValue(router as never));

  it("dice qué no está y vuelve a donde se vino", () => {
    render(<NotFoundState title="Clase no encontrada" />);

    expect(screen.getByText("Clase no encontrada")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Volver" }));
    expect(router.back).toHaveBeenCalled();
  });
});
