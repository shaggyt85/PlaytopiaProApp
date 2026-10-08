import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AppUpdateGate } from "@/features/app-update/components/AppUpdateGate";
import type { StoreUrls } from "@/features/app-update/schemas/versionCheck.schema";
import { versionCheckService } from "@/features/app-update/services/versionCheckService";
import { useAppUpdateStore } from "@/features/app-update/store/appUpdateStore";

import { renderWithProviders } from "../../../helpers/renderWithProviders";

jest.mock("@/shared/config/appVersion", () => ({ APP_VERSION: "1.0.0" }));
jest.mock("@/features/app-update/services/versionCheckService", () => ({
  ...jest.requireActual("@/features/app-update/services/versionCheckService"),
  versionCheckService: { check: jest.fn() },
}));

const urls: StoreUrls = { ios: "https://apps.apple.com/pro", android: null };
const answer = (update_type: "force" | "soft" | "none", store_url: StoreUrls = urls) =>
  jest.mocked(versionCheckService.check).mockResolvedValue({ update_type, store_url });

const renderGate = () =>
  renderWithProviders(
    <AppUpdateGate>
      <Text>La app</Text>
    </AppUpdateGate>,
  );

describe("AppUpdateGate", () => {
  beforeEach(() => act(() => useAppUpdateStore.setState({ softDismissed: false })));

  it("al día, solo la app", async () => {
    answer("none");
    renderGate();

    expect(await screen.findByText("La app")).toBeTruthy();
    expect(screen.queryByTestId("soft-update-sheet")).toBeNull();
  });

  it("con una versión que ya no vale, la pantalla de actualizar en lugar de la app", async () => {
    answer("force");
    renderGate();

    expect(await screen.findByTestId("force-update-screen")).toBeTruthy();
    expect(screen.queryByText("La app")).toBeNull();
  });

  it("con una nueva, la app y el aviso encima; «Ahora no» lo cierra hasta que se cierre la app", async () => {
    answer("soft");
    const { unmount } = renderGate();

    expect(await screen.findByTestId("soft-update-sheet")).toBeTruthy();
    expect(screen.getByText("La app")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Ahora no" }));
    expect(useAppUpdateStore.getState().softDismissed).toBe(true);

    unmount();
    renderGate();
    expect(await screen.findByText("La app")).toBeTruthy();
    expect(screen.queryByTestId("soft-update-sheet")).toBeNull();
  });

  it("sin URL de la tienda, el aviso que se puede cerrar no sale", async () => {
    answer("soft", { ios: null, android: null });
    renderGate();

    expect(await screen.findByText("La app")).toBeTruthy();
    expect(screen.queryByTestId("soft-update-sheet")).toBeNull();
  });
});
