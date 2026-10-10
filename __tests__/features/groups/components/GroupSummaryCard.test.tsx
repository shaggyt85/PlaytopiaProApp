import { fireEvent, render, screen } from "@testing-library/react-native";

import { GroupSummaryCard } from "@/features/groups/components/GroupSummaryCard";
import type { TeacherGroup } from "@/features/groups/utils/groupsFromAgenda";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const group: TeacherGroup = {
  key: "4-11",
  next: scheduleClass({
    group_id: 11,
    title: "Cantera Intermedios",
    level_range: "2,0–3,0",
    track_name: "Pista 1",
    class_date: "2026-10-05",
    class_time: "18:00:00",
    duration_minutes: 90,
  }),
  weekdayDates: ["2026-10-05"],
  upcoming: 3,
};

describe("GroupSummaryCard", () => {
  it("su nombre, cuándo es, dónde y su rango de nivel", () => {
    render(<GroupSummaryCard group={group} clubLabel="Sede Centro" onPress={jest.fn()} />);

    expect(screen.getByText("Cantera Intermedios", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Lunes · 18:00–19:30", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Sede Centro · Pista 1", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("2,0–3,0", { includeHiddenElements: true })).toBeTruthy();
  });

  it("sin nivel, no pinta la fila del rango ni lo lee", () => {
    const withoutLevel = { ...group, next: { ...group.next, level_range: null } };
    render(<GroupSummaryCard group={withoutLevel} clubLabel="Sede Centro" onPress={jest.fn()} />);

    expect(screen.queryByText("2,0–3,0", { includeHiddenElements: true })).toBeNull();
    expect(screen.getByLabelText("Su grupo, Cantera Intermedios, Lunes · 18:00–19:30, Sede Centro · Pista 1")).toBeTruthy();
  });

  it("se lee de una vez y, al tocarla, vuelve al grupo", () => {
    const onPress = jest.fn();
    render(<GroupSummaryCard group={group} clubLabel="Sede Centro" onPress={onPress} />);

    fireEvent.press(screen.getByLabelText(/^Su grupo, Cantera Intermedios, Lunes · 18:00–19:30/));

    expect(onPress).toHaveBeenCalled();
  });
});
