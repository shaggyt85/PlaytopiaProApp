import { fireEvent, renderRouter, screen } from "expo-router/testing-library";

import CalendarRoute from "@/app/(app)/(tabs)/calendar";
import GroupsRoute from "@/app/(app)/(tabs)/groups";
import HomeRoute from "@/app/(app)/(tabs)/index";
import NetworkRoute from "@/app/(app)/(tabs)/network";
import ProfileRoute from "@/app/(app)/(tabs)/profile";
import TabsLayout from "@/app/(app)/(tabs)/_layout";

const routes = {
  "(tabs)/_layout": TabsLayout,
  "(tabs)/index": HomeRoute,
  "(tabs)/calendar": CalendarRoute,
  "(tabs)/groups": GroupsRoute,
  "(tabs)/network": NetworkRoute,
  "(tabs)/profile": ProfileRoute,
};

describe("menú inferior", () => {
  it("empieza en Hoy, con las 5 pestañas en orden y Hoy seleccionada", () => {
    renderRouter(routes, { initialUrl: "/" });

    expect(screen.getByTestId("home-screen")).toBeTruthy();
    expect(screen.getAllByRole("tab").map((tab) => tab.props.accessibilityLabel)).toEqual([
      "Hoy",
      "Agenda",
      "Grupos",
      "Red",
      "Perfil",
    ]);
    expect(screen.getByRole("tab", { name: "Hoy", selected: true })).toBeTruthy();
  });

  it.each([
    ["Agenda", "/calendar"],
    ["Grupos", "/groups"],
    ["Red", "/network"],
    ["Perfil", "/profile"],
  ])("la pestaña %s lleva a %s y muestra su «Próximamente»", (label, path) => {
    renderRouter(routes, { initialUrl: "/" });

    fireEvent.press(screen.getByRole("tab", { name: label }));

    expect(screen).toHavePathname(path);
    expect(screen.getByRole("tab", { name: label, selected: true })).toBeTruthy();
    expect(screen.getByText("Próximamente")).toBeTruthy();
  });

  it("la barra sigue en pantalla al cambiar de pestaña", () => {
    renderRouter(routes, { initialUrl: "/calendar" });

    fireEvent.press(screen.getByRole("tab", { name: "Hoy" }));

    expect(screen.getByTestId("home-screen")).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(5);
  });
});
