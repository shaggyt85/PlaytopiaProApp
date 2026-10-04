import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import type { ScrollView, View } from "react-native";

import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import { useTheme } from "@/shared/hooks/useTheme";

/** Lleva un elemento de la Agenda a la vista (`null` no hace nada). */
type ScrollIntoView = (target: View | null) => void;

const ScrollIntoViewContext = createContext<ScrollIntoView>(() => undefined);

/**
 * Las referencias del desplazamiento de la Agenda: la pantalla las da a su
 * `TabScrollView` y monta el `ScheduleScrollProvider` con ellas.
 */
export function useScheduleScrollRefs() {
  const scrollRef = useRef<ScrollView>(null);
  const innerViewRef = useRef<View>(null);
  return useMemo(() => ({ scrollRef, innerViewRef }), []);
}

interface ScheduleScrollProviderProps extends ReturnType<typeof useScheduleScrollRefs> {
  children: ReactNode;
}

/**
 * Deja que una vista de la Agenda (la lista del Mes) lleve uno de sus elementos
 * a la vista sin conocer la pantalla: lo mide respecto al contenido desplazable y
 * desplaza hasta él, con un respiro arriba. Con «reducir movimiento», sin animar.
 */
export function ScheduleScrollProvider({ scrollRef, innerViewRef, children }: ScheduleScrollProviderProps) {
  const reduceMotion = useReduceMotion();
  const theme = useTheme();
  const margin = theme.spacing.md;

  const scrollIntoView = useCallback<ScrollIntoView>(
    (target) => {
      const scroll = scrollRef.current;
      const inner = innerViewRef.current;
      if (!target || !scroll || !inner) return;
      target.measureLayout(inner, (_x, y) => scroll.scrollTo({ y: Math.max(0, y - margin), animated: !reduceMotion }));
    },
    [scrollRef, innerViewRef, margin, reduceMotion],
  );

  return <ScrollIntoViewContext.Provider value={scrollIntoView}>{children}</ScrollIntoViewContext.Provider>;
}

/** Llevar un elemento a la vista dentro de la Agenda. Fuera de ella no hace nada. */
export function useScrollIntoView(): ScrollIntoView {
  return useContext(ScrollIntoViewContext);
}
