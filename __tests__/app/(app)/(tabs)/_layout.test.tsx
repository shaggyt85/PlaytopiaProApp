import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";

import CalendarRoute from "@/app/(app)/(tabs)/calendar";
import GroupsRoute from "@/app/(app)/(tabs)/groups";
import HomeRoute from "@/app/(app)/(tabs)/index";
import NetworkRoute from "@/app/(app)/(tabs)/network";
import ProfileRoute from "@/app/(app)/(tabs)/profile";
import TabsLayout from "@/app/(app)/(tabs)/_layout";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherProfileService } from "@/shared/services/teacherProfileService";

import { teacherProfile } from "../../../helpers/authFactories";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));

// En la app lo pone AppProviders, en el layout raíz (Hoy pide el perfil).
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const routes = {
  "(tabs)/_layout": TabsLayout,
  "(tabs)/index": HomeRoute,
  "(tabs)/calendar": CalendarRoute,
  "(tabs)/groups": GroupsRoute,
  "(tabs)/network": NetworkRoute,
  "(tabs)/profile": ProfileRoute,
};

describe("menú inferior", () => {
  beforeEach(() => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
  });

  it("empieza en Hoy, con las 5 pestañas en orden y Hoy seleccionada", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

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
    renderRouter(routes, { initialUrl: "/", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: label }));

    expect(screen).toHavePathname(path);
    expect(screen.getByRole("tab", { name: label, selected: true })).toBeTruthy();
    expect(screen.getByText("Próximamente")).toBeTruthy();
  });

  it("la barra sigue en pantalla al cambiar de pestaña", () => {
    renderRouter(routes, { initialUrl: "/calendar", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Hoy" }));

    expect(screen.getByTestId("home-screen")).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(5);
  });
});
