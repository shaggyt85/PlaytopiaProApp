import { renderHook, waitFor } from "@testing-library/react-native";

import { loadFonts } from "@/shared/config/fonts";
import { restoreSavedLanguage } from "@/shared/config/i18n";
import { useAppReady } from "@/shared/hooks/useAppReady";
import { session } from "@/shared/services/session";

jest.mock("@/shared/config/assets", () => ({
  preloadBrandAssets: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/shared/config/fonts", () => ({
  loadFonts: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/shared/services/session", () => ({
  session: { restore: jest.fn() },
}));
jest.mock("@/shared/config/i18n", () => ({
  ...jest.requireActual("@/shared/config/i18n"),
  restoreSavedLanguage: jest.fn(),
}));

describe("useAppReady", () => {
  it("está listo cuando terminan idioma, sesión, precarga del logo y fuentes", async () => {
    jest.mocked(restoreSavedLanguage).mockResolvedValue();
    jest.mocked(session.restore).mockResolvedValue();

    const { result } = renderHook(() => useAppReady());

    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
    expect(loadFonts).toHaveBeenCalled();
  });

  it("no pinta nada mientras cargan las fuentes", async () => {
    jest.mocked(restoreSavedLanguage).mockResolvedValue();
    jest.mocked(session.restore).mockResolvedValue();
    let finishFonts: () => void = () => undefined;
    jest.mocked(loadFonts).mockReturnValue(new Promise((resolve) => (finishFonts = resolve)));

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(session.restore).toHaveBeenCalled());
    expect(result.current).toBe(false);
    finishFonts();
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("si las fuentes fallan arranca igual, con las del sistema", async () => {
    jest.mocked(restoreSavedLanguage).mockResolvedValue();
    jest.mocked(session.restore).mockResolvedValue();
    jest.mocked(loadFonts).mockRejectedValue(new Error("fuente"));

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("también arranca si una de las dos falla (nunca se queda en el splash)", async () => {
    jest.mocked(restoreSavedLanguage).mockRejectedValue(new Error("storage"));
    jest.mocked(session.restore).mockResolvedValue();

    const { result } = renderHook(() => useAppReady());

    await waitFor(() => expect(result.current).toBe(true));
  });
});
