import { renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";
import type { ScrollView, View } from "react-native";

import { ScheduleScrollProvider, useScrollIntoView } from "@/features/schedule/hooks/useScheduleScroll";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const scrollTo = jest.fn();
const inner = {} as View;
const refs = {
  scrollRef: { current: { scrollTo } as unknown as ScrollView },
  innerViewRef: { current: inner },
};
/** Un elemento que está a `y` del principio del contenido desplazable. */
const at = (y: number) =>
  ({
    measureLayout: (_relative: View, onSuccess: (x: number, y: number) => void) => onSuccess(0, y),
  }) as unknown as View;

const wrapper = ({ children }: { children: ReactNode }) => <ScheduleScrollProvider {...refs}>{children}</ScheduleScrollProvider>;

describe("useScrollIntoView", () => {
  beforeEach(() => {
    scrollTo.mockClear();
    jest.mocked(useReduceMotion).mockReturnValue(false);
  });

  it("lleva el elemento a la vista, con un respiro arriba", () => {
    const { result } = renderHook(() => useScrollIntoView(), { wrapper });

    result.current(at(500));

    expect(scrollTo).toHaveBeenCalledWith({ y: 484, animated: true });
  });

  it("nunca por encima del principio", () => {
    const { result } = renderHook(() => useScrollIntoView(), { wrapper });

    result.current(at(5));

    expect(scrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
  });

  it("con «reducir movimiento», sin animar", () => {
    jest.mocked(useReduceMotion).mockReturnValue(true);
    const { result } = renderHook(() => useScrollIntoView(), { wrapper });

    result.current(at(500));

    expect(scrollTo).toHaveBeenCalledWith({ y: 484, animated: false });
  });

  it("sin elemento, o fuera de la Agenda, no hace nada", () => {
    const { result } = renderHook(() => useScrollIntoView(), { wrapper });
    result.current(null);
    expect(scrollTo).not.toHaveBeenCalled();

    const outside = renderHook(() => useScrollIntoView());
    expect(() => outside.result.current(at(500))).not.toThrow();
  });
});
