import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

describe("useReduceMotion", () => {
  afterEach(() => jest.restoreAllMocks());

  it("lee la preferencia del sistema", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);

    const { result } = renderHook(() => useReduceMotion());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("se entera si el usuario la cambia con la app abierta", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
    let notify: (enabled: boolean) => void = () => undefined;
    jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, handler) => {
      notify = handler as (enabled: boolean) => void;
      return { remove: jest.fn() } as never;
    });

    const { result } = renderHook(() => useReduceMotion());
    await waitFor(() => expect(result.current).toBe(false));

    act(() => notify(true));

    expect(result.current).toBe(true);
  });
});
