import { render, screen } from "@testing-library/react-native";

import { LogoSection } from "@/features/auth/components/LogoSection";

jest.mock("expo-constants", () => ({ expoConfig: { version: "1.0.0" } }));

describe("LogoSection", () => {
  it("muestra la marca y la versión de la app", () => {
    render(<LogoSection />);

    expect(screen.getByText("Playtopia Pro")).toBeTruthy();
    expect(screen.getByText("v1.0.0")).toBeTruthy();
  });

  it("pone el subtítulo (el correo) justo debajo de la versión", () => {
    render(<LogoSection subtitle="pancho@test.com" />);

    expect(screen.getByText("pancho@test.com")).toBeTruthy();
  });

  it("sin subtítulo no añade nada bajo la versión", () => {
    render(<LogoSection />);

    expect(screen.queryByText("pancho@test.com")).toBeNull();
  });
});
