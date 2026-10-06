import { render, screen } from "@testing-library/react-native";
import { FlatList, Text } from "react-native";

import { TAB_BAR_HEIGHT } from "@/shared/components/TabBar";
import { TabFlatList } from "@/shared/components/TabFlatList";

const renderList = () =>
  render(
    <TabFlatList
      data={["uno", "dos"]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => <Text>{item}</Text>}
      header={<Text>Cabecera</Text>}
    />,
  );

describe("TabFlatList", () => {
  it("lleva el logo arriba, luego la cabecera y luego las filas", () => {
    renderList();

    expect(screen.getByRole("image", { name: "Playtopia" })).toBeTruthy();
    expect(screen.getByText("Cabecera")).toBeTruthy();
    expect(screen.getByText("uno")).toBeTruthy();
    expect(screen.getByText("dos")).toBeTruthy();
  });

  it("deja abajo el hueco de la barra flotante", () => {
    renderList();

    const { contentContainerStyle } = screen.UNSAFE_getByType(FlatList).props;
    const paddingBottom = [contentContainerStyle].flat(2).find((s) => s?.paddingBottom)?.paddingBottom;
    expect(paddingBottom).toBeGreaterThanOrEqual(TAB_BAR_HEIGHT);
  });
  it("sin barra de desplazamiento: es un móvil", () => {
    renderList();

    expect(screen.UNSAFE_getByType(FlatList).props.showsVerticalScrollIndicator).toBe(false);
  });
});
