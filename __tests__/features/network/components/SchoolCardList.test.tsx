import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { SchoolCardList, type SchoolCardListProps } from "@/features/network/components/SchoolCardList";
import { HttpError } from "@/shared/services/HttpError";

import { schoolCard } from "../../../helpers/networkFactories";

jest.mock("expo-image", () => ({ Image: () => null }));

const renderList = (props: Partial<SchoolCardListProps> = {}) =>
  render(
    <SchoolCardList
      schools={undefined}
      error={null}
      onRetry={jest.fn()}
      empty={{ title: "Vacía", message: "No hay nada" }}
      header={<Text>Cabecera</Text>}
      refreshing={false}
      onRefresh={jest.fn()}
      testID="list"
      {...props}
    />,
  );

describe("SchoolCardList", () => {
  it("mientras carga, enseña «Cargando…» bajo la cabecera", () => {
    renderList();

    expect(screen.getByText("Cabecera")).toBeTruthy();
    expect(screen.getByLabelText("Cargando…")).toBeTruthy();
  });

  it("si falla sin nada que enseñar, el error con «Reintentar»", () => {
    const onRetry = jest.fn();
    renderList({ error: HttpError.network(), onRetry });

    fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(onRetry).toHaveBeenCalled();
  });

  it("sin sedes, el mensaje de lista vacía", () => {
    renderList({ schools: [] });

    expect(screen.getByText("Vacía")).toBeTruthy();
    expect(screen.getByText("No hay nada")).toBeTruthy();
  });

  it("pinta una tarjeta por sede, con su clave", () => {
    renderList({ schools: [schoolCard(1, 1), schoolCard(2, 1)] });

    expect(screen.getByTestId("list-1-1")).toBeTruthy();
    expect(screen.getByTestId("list-2-1")).toBeTruthy();
    expect(screen.queryByLabelText("Cargando…")).toBeNull();
  });

  it("con sedes, un error (de una recarga o de otra página) no las tapa", () => {
    renderList({ schools: [schoolCard(1, 1)], error: HttpError.network() });

    expect(screen.getByTestId("list-1-1")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("mientras llega la página siguiente, un spinner al final", () => {
    renderList({ schools: [schoolCard(1, 1)], isFetchingNextPage: true });

    expect(screen.getByLabelText("Cargando…")).toBeTruthy();
  });

  it("al llegar al final avisa a quien la usa", () => {
    const onEndReached = jest.fn();
    renderList({ schools: [schoolCard(1, 1)], onEndReached });

    screen.getByTestId("list").props.onEndReached();

    expect(onEndReached).toHaveBeenCalled();
  });
});
