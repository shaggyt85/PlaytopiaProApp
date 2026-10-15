import { act, renderRouter, screen } from "expo-router/testing-library";

import TabsLayout from "@/app/(app)/(tabs)/_layout";
import HomeRoute from "@/app/(app)/(tabs)/index";
import AppLayout from "@/app/(app)/_layout";
import AuthLayout from "@/app/(auth)/_layout";
import SignInRoute from "@/app/(auth)/sign-in";
import RootLayout from "@/app/_layout";
import { versionCheckService } from "@/features/app-update/services/versionCheckService";
import { useSessionStore } from "@/shared/store/sessionStore";

jest.mock("@/shared/hooks/useAppReady", () => ({ useAppReady: () => true }));
jest.mock("@/features/splash", () => ({ Splash: () => null }));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock("@/shared/services/httpClient", () => ({ onSessionExpired: jest.fn() }));
jest.mock("@/shared/config/queryManagers", () => ({
  setupQueryManagers: () => () => undefined,
}));
jest.mock("@/shared/config/appVersion", () => ({ APP_VERSION: "1.0.0" }));
jest.mock("@/features/app-update/services/versionCheckService", () => ({
  ...jest.requireActual("@/features/app-update/services/versionCheckService"),
  versionCheckService: { check: jest.fn() },
}));

const storeUrls = { ios: "https://apps.apple.com/pro", android: null };

const routes = {
  _layout: RootLayout,
  "(app)/_layout": AppLayout,
  "(app)/(tabs)/_layout": TabsLayout,
  "(app)/(tabs)/index": HomeRoute,
  "(auth)/_layout": AuthLayout,
  "(auth)/sign-in": SignInRoute,
};

describe("guards de navegación", () => {
  beforeEach(() =>
    jest.mocked(versionCheckService.check).mockResolvedValue({ update_type: "none", store_url: storeUrls }),
  );

  it("sin sesión solo existe el login, aunque se pida el inicio", () => {
    useSessionStore.getState().setAnonymous();

    renderRouter(routes, { initialUrl: "/" });

    expect(screen.getByTestId("sign-in-screen")).toBeTruthy();
    expect(screen.queryByTestId("schedule-screen")).toBeNull();
  });

  it("con sesión de profesor se entra al inicio y el login no existe", () => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });

    renderRouter(routes, { initialUrl: "/sign-in" });

    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
    expect(screen.queryByTestId("sign-in-screen")).toBeNull();
  });

  it("si la sesión se cierra, vuelve sola al login", () => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    renderRouter(routes, { initialUrl: "/" });
    expect(screen.getByTestId("schedule-screen")).toBeTruthy();

    act(() => useSessionStore.getState().setAnonymous());

    expect(screen.getByTestId("sign-in-screen")).toBeTruthy();
  });
});

describe("versión de la app", () => {
  it("si esta versión ya no vale, la pantalla de actualizar en lugar de la app", async () => {
    jest.mocked(versionCheckService.check).mockResolvedValue({ update_type: "force", store_url: storeUrls });
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });

    renderRouter(routes, { initialUrl: "/" });

    expect(await screen.findByTestId("force-update-screen")).toBeTruthy();
    expect(screen.queryByTestId("schedule-screen")).toBeNull();
  });
});
