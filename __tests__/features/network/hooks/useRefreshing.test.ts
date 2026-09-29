import { act, renderHook } from "@testing-library/react-native";

import { useRefreshing } from "@/features/network/hooks/useRefreshing";

describe("useRefreshing", () => {
  it("enciende el spinner mientras dura el refresco y lo apaga al terminar", async () => {
    let finish: () => void = () => undefined;
    const refresh = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    const { result } = renderHook(() => useRefreshing(refresh));
    expect(result.current.refreshing).toBe(false);

    let running: Promise<void> = Promise.resolve();
    act(() => {
      running = result.current.onRefresh();
    });
    expect(result.current.refreshing).toBe(true);

    await act(async () => {
      finish();
      await running;
    });
    expect(result.current.refreshing).toBe(false);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("si el refresco falla, el spinner se apaga igual y no lanza", async () => {
    const { result } = renderHook(() => useRefreshing(() => Promise.reject(new Error("sin red"))));

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(result.current.refreshing).toBe(false);
  });
});
