import { fireEvent, render, screen } from "@testing-library/react-native";

import { GroupCard } from "@/features/groups/components/GroupCard";
import type { TeacherGroup } from "@/features/groups/utils/groupsFromAgenda";
import { darkTheme } from "@/shared/config/theme";

import { classStudent, scheduleClass } from "../../../helpers/scheduleFactories";

const hidden = { includeHiddenElements: true };
const colors = darkTheme.clubColors[1];
const group: TeacherGroup = {
  key: "4-11",
  next: scheduleClass({
    title: "Cantera Intermedios",
    level_range: "2.5 - 3",
    class_date: "2026-10-05",
    class_time: "18:00:00",
    duration_minutes: 90,
    track_name: "Pista 1",
    current_participants: 2,
    max_participants: 4,
    students: [classStudent({ student_id: 54, name: "Diego", last_name: "Pérez" }), classStudent()],
  }),
  weekdayDates: ["2026-10-05", "2026-10-07"],
  upcoming: 6,
};

const renderCard = (onPress = jest.fn()) =>
  render(<GroupCard group={group} colors={colors} clubLabel="Club Padel Indoor Madrid" onPress={onPress} />);

describe("GroupCard", () => {
  it("como el prototipo: título, nivel, cuándo es, dónde, sus alumnos y las plazas", () => {
    renderCard();

    expect(screen.getByText("Cantera Intermedios", hidden)).toBeTruthy();
    expect(screen.getByText("2.5 - 3", hidden)).toHaveStyle({ color: colors.color });
    expect(screen.getByText("Lunes, miércoles · 18:00–19:30", hidden)).toBeTruthy();
    expect(screen.getByText("Club Padel Indoor Madrid · Pista 1", hidden)).toBeTruthy();
    expect(screen.getByText("2/4 alumnos", hidden)).toHaveStyle({ color: colors.color });
  });

  it("sus alumnos y, hasta las plazas, los huecos libres", () => {
    renderCard();

    expect(screen.getAllByTestId("student-avatar", hidden)).toHaveLength(2);
    expect(screen.getAllByTestId("student-avatar-empty", hidden)).toHaveLength(2);
  });

  it("se lee de una vez y, al tocarla, avisa con su grupo", () => {
    const onPress = jest.fn();
    renderCard(onPress);

    fireEvent.press(
      screen.getByRole("button", {
        name: "Cantera Intermedios, Nivel 2.5 - 3, Lunes, miércoles · 18:00–19:30, Club Padel Indoor Madrid · Pista 1, 2/4 alumnos",
      }),
    );

    expect(onPress).toHaveBeenCalledWith(group);
  });
});
