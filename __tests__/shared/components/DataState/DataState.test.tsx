import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { DataState } from "@/shared/components/DataState";

describe("DataState", () => {
  it("con datos, la vista, aunque falle una recarga", () => {
    render(
      <DataState hasData error={new Error("sin red")} onRetry={jest.fn()}>
        <Text>La semana</Text>
      </DataState>,
    );

    expect(screen.getByText("La semana")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
  });

  it("sin datos, «Cargando…»", () => {
    render(
      <DataState hasData={false} error={null} onRetry={jest.fn()}>
        <Text>La semana</Text>
      </DataState>,
    );

    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(screen.queryByText("La semana")).toBeNull();
  });

  it("sin datos y con error, el error con «Reintentar»", () => {
    const onRetry = jest.fn();
    render(
      <DataState hasData={false} error={new Error("sin red")} onRetry={onRetry}>
        <Text>La semana</Text>
      </DataState>,
    );

    fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
