import { fireEvent, render, screen } from "@testing-library/react-native";

import { NextSessionCard } from "@/features/groups/components/NextSessionCard";
import { darkTheme } from "@/shared/config/theme";

import { classStudent, scheduleClass } from "../../../helpers/scheduleFactories";

const next = scheduleClass({
  class_date: "2026-11-16",
  class_time: "16:00:00",
  students: [
    classStudent({ student_id: 54, name: "Diego" }),
    classStudent(),
    classStudent({ student_id: 77, name: "Marta", is_recovery: true }),
  ],
});

describe("NextSessionCard", () => {
  it("su día y hora, cuántos del grupo hay, cuántos recuperan (en oro) y cuántos se esperan", () => {
    render(<NextSessionCard next={next} onPress={jest.fn()} />);

    expect(screen.getByText("Lunes, 16 de noviembre · 16:00", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText(" · +1 recuperación", { includeHiddenElements: true })).toHaveStyle({
      color: darkTheme.accents.gold.color,
    });
    expect(screen.getByText("3 alumnos previstos", { includeHiddenElements: true })).toBeTruthy();
  });

  it("se lee de una vez y, al tocarla, abre la clase", () => {
    const onPress = jest.fn();
    render(<NextSessionCard next={next} onPress={onPress} />);

    fireEvent.press(
      screen.getByRole("button", {
        name: "Próxima clase, Lunes, 16 de noviembre · 16:00, 2 inscritos, +1 recuperación, 3 alumnos previstos",
      }),
    );

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
