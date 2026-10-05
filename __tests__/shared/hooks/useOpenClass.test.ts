import { renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { useOpenClass } from "@/shared/hooks/useOpenClass";

import { scheduleClass } from "../../helpers/scheduleFactories";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

describe("useOpenClass", () => {
  it("abre el detalle de la clase con su escuela, su id y su fecha", () => {
    const push = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ push } as never);
    const { result } = renderHook(() => useOpenClass());

    result.current(scheduleClass({ db_id: 4, id: 31, class_date: "2026-11-18" }));

    expect(push).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-11-18" },
    });
  });

  it("la función es la misma entre pintados", () => {
    jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as never);
    const { result, rerender } = renderHook(() => useOpenClass());
    const first = result.current;

    rerender({});

    expect(result.current).toBe(first);
  });
});
