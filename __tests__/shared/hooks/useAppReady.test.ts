import { renderHook, waitFor } from "@testing-library/react-native";

import { restoreSavedLanguage } from "@/shared/config/i18n";
import { useAppReady } from "@/shared/hooks/useAppReady";
import { session } from "@/shared/services/session";

jest.mock("@/shared/config/assets", () => ({
  preloadBrandAssets: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/shared/services/session", () => ({
  session: { restore: jest.fn() },
}));
jest.mock("@/shared/config/i18n", () => ({
  ...jest.requireActual("@/shared/config/i18n"),
  restoreSavedLanguage: jest.fn(),
}));

describe("useAppReady", () => {
  it("está listo cuando terminan idioma, sesión y precarga del logo", async () => {
    jest.mocked(restoreSavedLanguage).mockResolvedValue();
    jest.mocked(session.restore).mockResolvedValue();

    const { result } = renderHook(() => useAppReady());

    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("también arranca si una de las dos falla (nunca se queda en el splash)", async () => {
    jest.mocked(restoreSavedLanguage).mockRejectedValue(new Error("storage"));
    jest.mocked(session.restore).mockResolvedValue();

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
  });
});
