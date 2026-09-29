import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { WeekDayCard } from "@/features/schedule/components/WeekDayCard";
import type { DayTense } from "@/features/schedule/utils/scheduleDates";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import { darkTheme } from "@/shared/config/theme";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const clubOf = () => ({ label: "Wave Padel Club", colors: darkTheme.clubColors[2] });
const morning = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "08:30:00", duration_minutes: 60 });
const evening = scheduleClass({ id: 2, class_date: "2026-11-18", class_time: "19:00:00", duration_minutes: 60 });

function setup(tense: DayTense, classes = [morning, evening], nowWall?: number) {
  render(
    <WeekDayCard
      date="2026-11-18"
      tense={tense}
      picked={false}
      classes={classes}
      nowWall={nowWall}
      clubOf={clubOf}
    />,
  );
}
const opacityOf = (id: number) => StyleSheet.flatten(screen.getByTestId(`week-class-${id}`).props.style).opacity;

describe("WeekDayCard", () => {
  it("hoy: «Miércoles 18», «Hoy · 23:10» y sus clases", () => {
    setup("today", undefined, wallAsUtcMs("2026-11-18", "10:00:00"));

    expect(screen.getByText("Miércoles 18")).toBeTruthy();
    expect(screen.getByText("Hoy · 10:00")).toBeTruthy();
    expect(screen.getByText("2 clases")).toBeTruthy();
    expect(opacityOf(1)).toBe(PAST_OPACITY);
    expect(opacityOf(2)).toBeUndefined();
  });

  it("otro día, sin la pastilla de hoy", () => {
    setup("future");

    expect(screen.queryByText(/^Hoy · /)).toBeNull();
    expect(opacityOf(1)).toBeUndefined();
  });

  it("un día que ya pasó, sus clases apagadas", () => {
    setup("past");

    expect(opacityOf(1)).toBe(PAST_OPACITY);
    expect(opacityOf(2)).toBe(PAST_OPACITY);
  });

  it("sin clases, «Día libre»", () => {
    setup("future", []);

    expect(screen.getByText("0 clases")).toBeTruthy();
    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });
});
