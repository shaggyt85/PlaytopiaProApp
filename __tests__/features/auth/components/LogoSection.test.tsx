import { render, screen } from "@testing-library/react-native";

import { LogoSection } from "@/features/auth/components/LogoSection";

jest.mock("expo-constants", () => ({ expoConfig: { version: "1.0.0" } }));

describe("LogoSection", () => {
  it("muestra la marca y la versión de la app", () => {
    render(<LogoSection />);

    expect(screen.getByText("Playtopia")).toBeTruthy();
    expect(screen.getByText("v1.0.0")).toBeTruthy();
  });
});
