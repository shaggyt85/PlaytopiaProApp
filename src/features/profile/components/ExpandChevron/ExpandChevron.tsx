import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Chevron } from "@/shared/components/Chevron";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

import { EXPAND_ANIMATION } from "./ExpandChevron.animation";

interface ExpandChevronProps {
  /** Lo que abre está abierto: la › mira hacia abajo. */
  expanded: boolean;
}

/**
 * La › de un desplegable de Perfil (el historial de horas y cada mes): gira un
 * cuarto de vuelta al abrirlo (`rotate-90`). Solo `transform`, en el hilo de la
 * interfaz; con «reducir movimiento», cambia sin girar.
 */
export function ExpandChevron({ expanded }: ExpandChevronProps) {
  const reduceMotion = useReduceMotion();
  const target = expanded ? EXPAND_ANIMATION.openDeg : 0;
  const rotation = useSharedValue(target);

  useEffect(() => {
    rotation.set(reduceMotion ? target : withTiming(target, { duration: EXPAND_ANIMATION.durationMs }));
  }, [target, reduceMotion, rotation]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get()}deg` }] }));
  return (
    <Animated.View style={style} testID="expand-chevron">
      <Chevron />
    </Animated.View>
  );
}
