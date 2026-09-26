import { act, renderRouter, screen } from "expo-router/testing-library";

import TabsLayout from "@/app/(app)/(tabs)/_layout";
import HomeRoute from "@/app/(app)/(tabs)/index";
import AppLayout from "@/app/(app)/_layout";
import AuthLayout from "@/app/(auth)/_layout";
import SignInRoute from "@/app/(auth)/sign-in";
import RootLayout from "@/app/_layout";
import { useSessionStore } from "@/shared/store/sessionStore";

jest.mock("@/shared/hooks/useAppReady", () => ({ useAppReady: () => true }));
jest.mock("@/features/splash", () => ({ AnimatedSplash: () => null }));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock("@/shared/services/httpClient", () => ({ onSessionExpired: jest.fn() }));
jest.mock("@/shared/config/queryManagers", () => ({
  setupQueryManagers: () => () => undefined,
}));

const routes = {
  _layout: RootLayout,
  "(app)/_layout": AppLayout,
  "(app)/(tabs)/_layout": TabsLayout,
  "(app)/(tabs)/index": HomeRoute,
  "(auth)/_layout": AuthLayout,
  "(auth)/sign-in": SignInRoute,
};

describe("guards de navegación", () => {
  it("sin sesión solo existe el login, aunque se pida el inicio", () => {
    useSessionStore.getState().setAnonymous();

    renderRouter(routes, { initialUrl: "/" });

    expect(screen.getByTestId("sign-in-screen")).toBeTruthy();
    expect(screen.queryByTestId("home-screen")).toBeNull();
  });

  it("con sesión de profesor se entra al inicio y el login no existe", () => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });

    renderRouter(routes, { initialUrl: "/sign-in" });

    expect(screen.getByTestId("home-screen")).toBeTruthy();
    expect(screen.queryByTestId("sign-in-screen")).toBeNull();
  });

  it("si la sesión se cierra, vuelve sola al login", () => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    renderRouter(routes, { initialUrl: "/" });
    expect(screen.getByTestId("home-screen")).toBeTruthy();

    act(() => useSessionStore.getState().setAnonymous());

    expect(screen.getByTestId("sign-in-screen")).toBeTruthy();
  });
});
