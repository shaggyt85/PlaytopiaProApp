import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { StudentAvatar } from "@/features/schedule/components/StudentAvatar";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const lucia = { name: "Lucía", last_name: "Romero" };
const styleOf = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID).props.style);

describe("StudentAvatar", () => {
  it("sus iniciales con el degradado de su posición", () => {
    render(<StudentAvatar student={lucia} index={1} size="md" />);

    expect(screen.getByText("LR")).toBeTruthy();
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.clubColors[1].gradient }));
  });

  it("los dos tamaños del prototipo: 36 y 44", () => {
    const { rerender } = render(<StudentAvatar student={lucia} index={0} size="sm" />);
    expect(styleOf("student-avatar")).toMatchObject({ width: 36, height: 36 });

    rerender(<StudentAvatar student={lucia} index={0} size="md" />);
    expect(styleOf("student-avatar")).toMatchObject({ width: 44, height: 44 });
  });

  it("sin `recovery`, sin la «R» (la lista del detalle marca la recuperación a su manera)", () => {
    render(<StudentAvatar student={lucia} index={0} size="md" />);

    expect(screen.queryByTestId("student-avatar-recovery")).toBeNull();
  });

  it("con `recovery`, la «R» fuera del círculo para que no se recorte", () => {
    render(<StudentAvatar student={lucia} index={0} size="sm" ring recovery />);

    expect(screen.getByTestId("student-avatar-recovery")).toBeTruthy();
    expect(styleOf("student-avatar").borderColor).toBe(darkTheme.accents.gold.color);
  });

  it("«+N», sin degradado", () => {
    render(<StudentAvatar more={3} size="sm" ring />);

    expect(screen.getByText("+3")).toBeTruthy();
    expect(mockGradient).not.toHaveBeenCalled();
    expect(styleOf("student-avatar-more").borderWidth).toBe(2);
  });
});
