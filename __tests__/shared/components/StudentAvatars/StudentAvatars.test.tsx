import { render, screen } from "@testing-library/react-native";

import { MAX_AVATARS, StudentAvatars } from "@/shared/components/StudentAvatars";
import { darkTheme } from "@/shared/config/theme";

import { classStudent } from "../../../helpers/scheduleFactories";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const hidden = { includeHiddenElements: true };
const student = (name: string, last_name: string, is_recovery = false) =>
  classStudent({ name, last_name, is_recovery });

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

  it("con 4 alumnos caben los 4", () => {
    const four = Array.from({ length: MAX_AVATARS }, (_, i) => student(`Alumno${i}`, "X"));
    render(<StudentAvatars students={four} />);

    expect(screen.getAllByTestId("student-avatar", hidden)).toHaveLength(MAX_AVATARS);
    expect(screen.queryByTestId("student-avatar-more", hidden)).toBeNull();
  });

  it("con más de 4 alumnos, 3 círculos y «+N», como el prototipo", () => {
    const many = Array.from({ length: 7 }, (_, i) => student(`Alumno${i}`, "X"));
    render(<StudentAvatars students={many} />);

    expect(screen.getAllByTestId("student-avatar", hidden)).toHaveLength(MAX_AVATARS - 1);
    expect(screen.getByText("+4", hidden)).toBeTruthy();
  });

  it("quien viene a recuperar lleva su «R» y el aro dorado", () => {
    render(<StudentAvatars students={[student("Lucía", "Romero", true), student("Diego", "Pérez")]} />);

    expect(screen.getAllByTestId("student-avatar-recovery", hidden)).toHaveLength(1);
    expect(screen.getByText("R", hidden)).toBeTruthy();
    expect(screen.getAllByTestId("student-avatar", hidden)[0]).toHaveStyle({ borderColor: darkTheme.accents.gold.color });
  });

  it("el lector de pantalla no los lee: la tarjeta ya dice cuántos son", () => {
    render(<StudentAvatars students={[student("Lucía", "Romero")]} />);

    expect(screen.queryByText("LR")).toBeNull();
  });

  it("con las plazas, los huecos libres hasta completarlas (y hasta 4)", () => {
    const { rerender } = render(<StudentAvatars students={[student("Lucía", "Romero")]} capacity={3} />);
    expect(screen.getAllByTestId("student-avatar-empty", hidden)).toHaveLength(2);

    rerender(<StudentAvatars students={[student("Lucía", "Romero")]} capacity={10} />);
    expect(screen.getAllByTestId("student-avatar-empty", hidden)).toHaveLength(MAX_AVATARS - 1);
  });

  it("con «+N» no caben huecos; sin plazas, tampoco", () => {
    const many = Array.from({ length: 7 }, (_, i) => student(`Alumno${i}`, "X"));
    const { rerender } = render(<StudentAvatars students={many} capacity={8} />);
    expect(screen.queryByTestId("student-avatar-empty", hidden)).toBeNull();

    rerender(<StudentAvatars students={[student("Lucía", "Romero")]} />);
    expect(screen.queryByTestId("student-avatar-empty", hidden)).toBeNull();
  });
});
