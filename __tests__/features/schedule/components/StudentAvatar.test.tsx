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

  it("los dos tamaños del prototipo: 32 y 44", () => {
    const { rerender } = render(<StudentAvatar student={lucia} index={0} size="sm" />);
    expect(styleOf("student-avatar")).toMatchObject({ width: 32, height: 32 });

    rerender(<StudentAvatar student={lucia} index={0} size="md" />);
    expect(styleOf("student-avatar")).toMatchObject({ width: 44, height: 44 });
  });

  it("«+N», sin degradado", () => {
    render(<StudentAvatar more={3} size="sm" ring />);

    expect(screen.getByText("+3")).toBeTruthy();
    expect(mockGradient).not.toHaveBeenCalled();
    expect(styleOf("student-avatar-more").borderWidth).toBe(2);
  });
});
