import { act, renderHook } from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";

import { useForegroundNow } from "@/features/schedule/hooks/useForegroundNow";
import { serverNow } from "@/shared/utils/serverClock";

jest.mock("@/shared/utils/serverClock", () => ({ serverNow: jest.fn() }));

describe("useForegroundNow", () => {
  it("se renueva al volver la app al primer plano, no al irse", () => {
    const remove = jest.fn();
    const listen = jest.spyOn(AppState, "addEventListener").mockReturnValue({ remove });
    jest.mocked(serverNow).mockReturnValue(1_000);
    const { result, unmount } = renderHook(() => useForegroundNow());
    const onChange = listen.mock.calls[0][1] as (state: AppStateStatus) => void;
    expect(result.current).toBe(1_000);

    jest.mocked(serverNow).mockReturnValue(2_000);
    act(() => onChange("background"));
    expect(result.current).toBe(1_000);

    act(() => onChange("active"));
    expect(result.current).toBe(2_000);

    unmount();
    expect(remove).toHaveBeenCalled();
    listen.mockRestore();
  });
});

describe("useForegroundNow con everyMinute", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(AppState, "addEventListener").mockReturnValue({ remove: jest.fn() });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("se renueva al empezar cada minuto, alineado al segundo 0", () => {
    let clock = 10 * 60_000 + 45_000; // mm:45
    jest.mocked(serverNow).mockImplementation(() => clock);
    const { result, unmount } = renderHook(() => useForegroundNow({ everyMinute: true }));

    const advance = (ms: number) =>
      act(() => {
        clock += ms;
        jest.advanceTimersByTime(ms);
      });

    advance(14_999);
    expect(result.current).toBe(10 * 60_000 + 45_000);

    advance(1);
    expect(result.current).toBe(11 * 60_000);

    advance(60_000);
    expect(result.current).toBe(12 * 60_000);

    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("sin everyMinute no programa nada", () => {
    jest.mocked(serverNow).mockReturnValue(0);
    renderHook(() => useForegroundNow());

    expect(jest.getTimerCount()).toBe(0);
  });
});
