import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";

import CalendarRoute from "@/app/(app)/(tabs)/calendar";
import GroupsRoute from "@/app/(app)/(tabs)/groups";
import HomeRoute from "@/app/(app)/(tabs)/index";
import NetworkRoute from "@/app/(app)/(tabs)/network";
import ProfileRoute from "@/app/(app)/(tabs)/profile";
import TabsLayout from "@/app/(app)/(tabs)/_layout";
import { networkService } from "@/features/network/services/networkService";
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
jest.mock("@/features/network/services/networkService", () => ({
  ...jest.requireActual("@/features/network/services/networkService"),
  networkService: { getMyClubs: jest.fn(), getJoinableSchools: jest.fn() },
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
    jest.mocked(networkService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
  });

  it("empieza en Agenda (la pantalla de inicio), con las 4 pestañas en orden y Agenda seleccionada", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
    expect(screen.getAllByRole("tab").map((tab) => tab.props.accessibilityLabel)).toEqual([
      "Agenda",
      "Grupos",
      "Red",
      "Perfil",
    ]);
    expect(screen.getByRole("tab", { name: "Agenda", selected: true })).toBeTruthy();
  });

  it.each([
    ["Grupos", "/groups"],
    ["Perfil", "/profile"],
  ])("la pestaña %s lleva a %s y muestra su «Próximamente»", (label, path) => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: label }));

    expect(screen).toHavePathname(path);
    expect(screen.getByRole("tab", { name: label, selected: true })).toBeTruthy();
    expect(screen.getByText("Próximamente")).toBeTruthy();
  });

  it("la pestaña Red lleva a /network y abre Red de clubes", async () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Red" }));

    expect(screen).toHavePathname("/network");
    expect(screen.getByRole("tab", { name: "Red", selected: true })).toBeTruthy();
    expect(await screen.findByTestId("my-clubs-list-4-7")).toBeTruthy();
    expect(screen.queryByText("Próximamente")).toBeNull();
  });

  it("la barra sigue en pantalla al cambiar de pestaña", () => {
    renderRouter(routes, { initialUrl: "/groups", wrapper });

    fireEvent.press(screen.getByRole("tab", { name: "Agenda" }));

    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
  });
});
