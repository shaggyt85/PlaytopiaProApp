import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, renderRouter, screen, within } from "expo-router/testing-library";
import type { ReactNode } from "react";

import CalendarRoute from "@/app/(app)/(tabs)/calendar";
import GroupsRoute from "@/app/(app)/(tabs)/groups";
import HomeRoute from "@/app/(app)/(tabs)/index";
import NetworkRoute from "@/app/(app)/(tabs)/network";
import ProfileRoute from "@/app/(app)/(tabs)/profile";
import TabsLayout from "@/app/(app)/(tabs)/_layout";
import { myClubsService } from "@/shared/services/myClubsService";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../../helpers/authFactories";
import { schoolCard } from "../../../helpers/networkFactories";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/shared/services/myClubsService", () => ({
  ...jest.requireActual("@/shared/services/myClubsService"),
  myClubsService: { getMyClubs: jest.fn() },
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
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
  });

  it("empieza en Agenda (la pantalla de inicio), con las 3 pestañas en orden y Agenda seleccionada", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
    // Las del menú: la agenda tiene además su selector Día · Semana · Mes.
    const menu = within(screen.getByTestId("tab-bar"));
    expect(menu.getAllByRole("tab").map((tab) => tab.props.accessibilityLabel)).toEqual([
      "Agenda",
      "Grupos",
      "Perfil",
    ]);
    expect(screen.getByRole("tab", { name: "Agenda", selected: true })).toBeTruthy();
  });

  it("la pestaña Grupos lleva a /groups y muestra «Mis grupos»", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Grupos" }));

    expect(screen).toHavePathname("/groups");
    expect(screen.getByRole("tab", { name: "Grupos", selected: true })).toBeTruthy();
    expect(screen.getByTestId("groups-screen")).toBeTruthy();
  });

  it("la pestaña Perfil lleva a /profile y muestra «Mi perfil»", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Perfil" }));

    expect(screen).toHavePathname("/profile");
    expect(screen.getByRole("tab", { name: "Perfil", selected: true })).toBeTruthy();
    expect(screen.getByTestId("profile-screen")).toBeTruthy();
  });

  it("Red está oculta: no sale en el menú y /network lleva a la Agenda", () => {
    renderRouter(routes, { initialUrl: "/network", wrapper });

    expect(screen.queryByRole("tab", { name: "Red" })).toBeNull();
    expect(screen).toHavePathname("/");
    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
  });

  it("la barra sigue en pantalla al cambiar de pestaña", () => {
    renderRouter(routes, { initialUrl: "/groups", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Agenda" }));

    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
    expect(within(screen.getByTestId("tab-bar")).getAllByRole("tab")).toHaveLength(3);
  });
});
