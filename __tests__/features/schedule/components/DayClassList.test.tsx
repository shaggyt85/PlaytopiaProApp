import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { DayClassList, type DayClassRowProps } from "@/features/schedule/components/DayClassList";
import { darkTheme } from "@/shared/config/theme";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

import { scheduleClass } from "../../../helpers/scheduleFactories";

// Una fila de prueba que enseña lo que recibe.
const Row = ({ item, colors, club, status }: DayClassRowProps) => (
  <Text>{`${item.id} · ${club.label} · ${status} · ${colors.color}`}</Text>
);
const clubOf = () => ({ label: "Wave", colors: darkTheme.clubColors[2] });
const morning = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "08:30:00", duration_minutes: 60 });
const evening = scheduleClass({ id: 2, class_date: "2026-11-18", class_time: "19:00:00", duration_minutes: 60 });

describe("DayClassList", () => {
  it("pinta cada clase con la fila que se le da, su club, su estado del día y su color en el día", () => {
    render(
      <DayClassList
        classes={[morning, evening]}
        tense="today"
        nowWall={wallAsUtcMs("2026-11-18", "10:00:00")}
        clubOf={clubOf}
        Row={Row}
      />,
    );

    expect(screen.getByText(`1 · Wave · past · ${darkTheme.clubColors[0].color}`)).toBeTruthy();
    expect(screen.getByText(`2 · Wave · upcoming · ${darkTheme.clubColors[1].color}`)).toBeTruthy();
  });

  it("hoy, la próxima según Core se marca", () => {
    render(
      <DayClassList
        classes={[morning, evening]}
        tense="today"
        nowWall={wallAsUtcMs("2026-11-18", "10:00:00")}
        nextClassId={evening.id}
        clubOf={clubOf}
        Row={Row}
      />,
    );

    expect(screen.getByText(/^2 · Wave · next/)).toBeTruthy();
  });

  it("un día que ya pasó, todas pasadas", () => {
    render(<DayClassList classes={[evening]} tense="past" clubOf={clubOf} Row={Row} />);

    expect(screen.getByText(/^2 · Wave · past/)).toBeTruthy();
  });

  it("sin clases, «Día libre»", () => {
    render(<DayClassList classes={[]} tense="future" clubOf={clubOf} Row={Row} />);

    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });
});
