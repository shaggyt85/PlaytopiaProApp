import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { HomeScreen } from "@/features/home/HomeScreen";
import { session } from "@/shared/services/session";

jest.mock("@/shared/services/session", () => ({
  session: { end: jest.fn().mockResolvedValue(undefined) },
}));

describe("HomeScreen (provisional)", () => {
  it("Cerrar sesión cierra la sesión (los guards llevan al login)", async () => {
    render(<HomeScreen />);

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Cerrar sesión" }));
    });

    expect(session.end).toHaveBeenCalledTimes(1);
  });
});
