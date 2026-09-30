import type { ReactNode } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

import { PRESS_ANIMATION } from "./PressableScale.animation";
import { useStyles } from "./PressableScale.styles";

interface PressableScaleProps {
  onPress: () => void;
  /** Ya traducido: lo que dice el lector de pantalla de lo que se toca. */
  accessibilityLabel: string;
  /** Ya traducido: qué pasa al tocarlo («Abre el detalle de la clase»). */
  accessibilityHint?: string;
  /** El estilo de lo que se toca (su caja): va en la parte que se encoge. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children: ReactNode;
}

/**
 * Lo que se toca en la agenda (una clase de la tira, de Semana o de Mes, la
 * próxima clase): se encoge un poco al pulsarlo, como en el prototipo. Solo con
 * `transform` y en el hilo de la interfaz; con «reducir movimiento», no se mueve.
 */
export function PressableScale({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
  children,
}: PressableScaleProps) {
  const styles = useStyles();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const pressTo = (value: number) => {
    if (!reduceMotion) scale.set(withTiming(value, PRESS_ANIMATION.timing));
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => pressTo(PRESS_ANIMATION.pressedScale)}
      onPressOut={() => pressTo(1)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={styles.fill}
    >
      {/* El testID va en la caja (la que lleva el estilo); un toque en ella llega al Pressable. */}
      <Animated.View style={[style, animatedStyle]} testID={testID}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
