import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ScheduleDataState } from "@/features/schedule/components/ScheduleDataState";

describe("ScheduleDataState", () => {
  it("con datos, la vista, aunque falle una recarga", () => {
    render(
      <ScheduleDataState hasData error={new Error("sin red")} onRetry={jest.fn()}>
        <Text>La semana</Text>
      </ScheduleDataState>,
    );

    expect(screen.getByText("La semana")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
  });

  it("sin datos, «Cargando…»", () => {
    render(
      <ScheduleDataState hasData={false} error={null} onRetry={jest.fn()}>
        <Text>La semana</Text>
      </ScheduleDataState>,
    );

    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(screen.queryByText("La semana")).toBeNull();
  });

  it("sin datos y con error, el error con «Reintentar»", () => {
    const onRetry = jest.fn();
    render(
      <ScheduleDataState hasData={false} error={new Error("sin red")} onRetry={onRetry}>
        <Text>La semana</Text>
      </ScheduleDataState>,
    );

    fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
