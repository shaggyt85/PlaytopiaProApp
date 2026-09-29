import { render, screen } from "@testing-library/react-native";

import { MAX_AVATARS, StudentAvatars } from "@/features/schedule/components/StudentAvatars";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const hidden = { includeHiddenElements: true };
const student = (name: string, last_name: string) => ({ name, last_name });

describe("StudentAvatars", () => {
  it("un círculo por alumno con sus iniciales y el color de su posición", () => {
    render(<StudentAvatars students={[student("Lucía", "Romero"), student("Diego", "Pérez")]} />);

    expect(screen.getByText("LR", hidden)).toBeTruthy();
    expect(screen.getByText("DP", hidden)).toBeTruthy();
    expect(mockGradient.mock.calls.map(([props]) => props.colors)).toEqual([
      darkTheme.clubColors[0].gradient,
      darkTheme.clubColors[1].gradient,
    ]);
  });

  it("con más de 4 alumnos, 4 círculos y «+N»", () => {
    const many = Array.from({ length: 7 }, (_, i) => student(`Alumno${i}`, "X"));
    render(<StudentAvatars students={many} />);

    expect(screen.getAllByTestId("student-avatar", hidden)).toHaveLength(MAX_AVATARS);
    expect(screen.getByText("+3", hidden)).toBeTruthy();
  });

  it("el lector de pantalla no los lee: la tarjeta ya dice cuántos son", () => {
    render(<StudentAvatars students={[student("Lucía", "Romero")]} />);

    expect(screen.queryByText("LR")).toBeNull();
  });
});
