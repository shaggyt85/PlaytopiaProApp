import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { usePreviousClass } from "@/features/schedule/hooks/usePreviousClass";
import { createQueryClient } from "@/shared/config/queryClient";

import { scheduleClass } from "../../../helpers/scheduleFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

function setup(getPreviousClass: jest.Mock) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => usePreviousClass(4, 31, { getPreviousClass }), { wrapper });
}

describe("usePreviousClass", () => {
  beforeEach(signInTeacher);

  it("la última clase del grupo de esa clase", async () => {
    const getPreviousClass = jest.fn().mockResolvedValue(scheduleClass({ id: 30 }));
    const { result } = setup(getPreviousClass);

    await waitFor(() => expect(result.current?.id).toBe(30));
    expect(getPreviousClass).toHaveBeenCalledWith(4, 31);
  });

  it("si no tiene, o mientras llega, o si falla, null: su sección no sale", async () => {
    const pending = setup(jest.fn().mockReturnValue(new Promise(() => undefined)));
    expect(pending.result.current).toBeNull();

    const failing = jest.fn().mockRejectedValue(new Error("sin red"));
    const { result } = setup(failing);
    await waitFor(() => expect(failing).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });
});
