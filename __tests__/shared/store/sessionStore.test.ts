import { act, renderHook } from "@testing-library/react-native";

import { useSessionStore, useSessionUserId } from "@/shared/store/sessionStore";

describe("useSessionUserId", () => {
  it("es el id del profesor con la sesión abierta, y undefined sin ella", () => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    const { result } = renderHook(() => useSessionUserId());
    expect(result.current).toBe(42);

    act(() => useSessionStore.getState().setAnonymous());
    expect(result.current).toBeUndefined();
  });
});
