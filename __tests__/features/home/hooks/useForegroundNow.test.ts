import { act, renderHook } from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";

import { useForegroundNow } from "@/features/home/hooks/useForegroundNow";
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
