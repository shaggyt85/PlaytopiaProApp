import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { StatusPill } from "@/features/schedule/components/StatusPill";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const styleOf = () => StyleSheet.flatten(screen.getByTestId("pill").props.style);

describe("StatusPill", () => {
  beforeEach(() => mockGradient.mockClear());

  it("«EN VIVO»: sobre coral", () => {
    render(<StatusPill variant="live" testID="pill" />);

    expect(screen.getByText("En vivo")).toBeTruthy();
    expect(styleOf().backgroundColor).toBe(darkTheme.accents.coral.color);
    expect(mockGradient).not.toHaveBeenCalled();
  });

  it("«PRÓXIMA»: sobre el degradado de marca", () => {
    render(<StatusPill variant="next" testID="pill" />);

    expect(screen.getByText("Próxima")).toBeTruthy();
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.brand }));
  });

  it("«COMPLETADA»: magenta suave, con su check", () => {
    render(<StatusPill variant="done" testID="pill" />);

    expect(screen.getByText("Completada")).toBeTruthy();
    expect(styleOf()).toMatchObject({ borderWidth: 1 });
    expect(StyleSheet.flatten(screen.getByText("Completada").props.style).color).toBe(darkTheme.colors.primary);
  });

  it("no se encoge junto a un título largo", () => {
    render(<StatusPill variant="live" testID="pill" />);

    expect(styleOf().flexShrink).toBe(0);
  });
});
