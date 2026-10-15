import { act, renderHook } from "@testing-library/react-native";
import { reloadAsync, useUpdates } from "expo-updates";

import { OTA_CHECK_TIMEOUT_MS, OTA_RELOAD_OPTIONS } from "@/features/splash/config/otaUpdate";
import { useOtaUpdate } from "@/features/splash/hooks/useOtaUpdate";

let mockEnabled = true;
jest.mock("expo-updates", () => ({
  get isEnabled() {
    return mockEnabled;
  },
  useUpdates: jest.fn(),
  reloadAsync: jest.fn(),
}));

type UpdatesState = ReturnType<typeof useUpdates>;

const quiet = {
  isStartupProcedureRunning: false,
  isChecking: false,
  isDownloading: false,
  isUpdatePending: false,
  isRestarting: false,
  isUpdateAvailable: false,
  restartCount: 0,
} as unknown as UpdatesState;

const setUpdates = (state: Partial<UpdatesState>) =>
  jest.mocked(useUpdates).mockReturnValue({ ...quiet, ...state } as UpdatesState);

describe("useOtaUpdate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockEnabled = true;
    jest.mocked(reloadAsync).mockResolvedValue(undefined);
    setUpdates({});
  });

  afterEach(() => jest.useRealTimers());

  it("sin actualización no retiene el splash ni enseña la tarjeta", () => {
    const { result } = renderHook(() => useOtaUpdate());

    expect(result.current).toEqual({ holdSplash: false, progress: null });
  });

  it("mientras pregunta, retiene el splash sin tarjeta", () => {
    setUpdates({ isChecking: true });
    const { result } = renderHook(() => useOtaUpdate());

    expect(result.current).toEqual({ holdSplash: true, progress: null });
  });

  it("si la pregunta pasa del tope, deja de esperar", () => {
    setUpdates({ isChecking: true });
    const { result } = renderHook(() => useOtaUpdate());

    act(() => jest.advanceTimersByTime(OTA_CHECK_TIMEOUT_MS));

    expect(result.current.holdSplash).toBe(false);
  });

  it("descargando, retiene el splash con el progreso real", () => {
    setUpdates({ isStartupProcedureRunning: true, isDownloading: true, downloadProgress: 0.42 });
    const { result } = renderHook(() => useOtaUpdate());

    expect(result.current).toEqual({ holdSplash: true, progress: 0.42 });
  });

  it("una vez descargando no hay tope", () => {
    setUpdates({ isDownloading: true, downloadProgress: 0.1 });
    const { result } = renderHook(() => useOtaUpdate());

    act(() => jest.advanceTimersByTime(OTA_CHECK_TIMEOUT_MS * 3));

    expect(result.current.holdSplash).toBe(true);
  });

  it("al terminar la descarga reinicia una sola vez, con la pantalla de recarga", () => {
    setUpdates({ isDownloading: true, downloadProgress: 0.9 });
    const { result, rerender } = renderHook(() => useOtaUpdate());

    setUpdates({ isUpdatePending: true });
    rerender({});
    rerender({});

    expect(reloadAsync).toHaveBeenCalledTimes(1);
    expect(reloadAsync).toHaveBeenCalledWith(OTA_RELOAD_OPTIONS);
    expect(result.current).toEqual({ holdSplash: true, progress: 1 });
  });

  it("si la descarga falla, se entra y ya no se espera en este arranque", () => {
    setUpdates({ isDownloading: true, downloadProgress: 0.3 });
    const { result, rerender } = renderHook(() => useOtaUpdate());

    setUpdates({});
    rerender({});
    expect(result.current.holdSplash).toBe(false);

    setUpdates({ isUpdatePending: true });
    rerender({});
    expect(result.current.holdSplash).toBe(false);
    expect(reloadAsync).not.toHaveBeenCalled();
  });

  it("si no se puede reiniciar, se entra con la versión que hay", async () => {
    jest.mocked(reloadAsync).mockRejectedValue(new Error("no"));
    setUpdates({ isUpdatePending: true });
    const { result } = renderHook(() => useOtaUpdate());

    await act(async () => {});

    expect(result.current.holdSplash).toBe(false);
  });

  it("con expo-updates apagado (desarrollo) nunca retiene", () => {
    mockEnabled = false;
    setUpdates({ isDownloading: true, downloadProgress: 0.5 });
    const { result } = renderHook(() => useOtaUpdate());

    expect(result.current).toEqual({ holdSplash: false, progress: null });
  });
});
