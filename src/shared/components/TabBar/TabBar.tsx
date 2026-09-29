import { usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { TABS, tabIndexForPath } from "@/shared/config/tabs";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import { useTheme } from "@/shared/hooks/useTheme";

import { DROP_ANIMATION as A, indicatorOffset, recoilTarget } from "./TabBar.animation";
import { useStyles } from "./TabBar.styles";

/**
 * Barra de pestañas flotante: píldora de cristal con la gota (degradado de
 * marca) bajo la pestaña activa. Recibe los botones como hijos y las props de
 * `TabList` (por `asChild`). La pestaña activa sale de la ruta y de `TABS`.
 */
export function TabBar({ style, children, ...rest }: ViewProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const activeIndex = tabIndexForPath(usePathname());
  const [tabWidth, setTabWidth] = useState(0);
  const placed = useRef(false);

  const x = useSharedValue(0);
  const scale = useSharedValue(1);
  const trailX = useSharedValue(0);
  const trailOpacity = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (tabWidth === 0 || activeIndex < 0) return;
    const to = indicatorOffset(activeIndex, tabWidth);
    // La primera vez, o con "reducir movimiento", la gota va directa.
    if (!placed.current || reduceMotion) {
      placed.current = true;
      x.value = to;
      trailX.value = to;
      return;
    }
    const from = x.value;
    const maxOffset = indicatorOffset(TABS.length - 1, tabWidth);

    x.value = withSequence(
      withTiming(recoilTarget(from, to, maxOffset), { duration: A.anticipationMs }),
      withSpring(to, A.spring),
    );
    scale.value = withSequence(
      withTiming(A.anticipationScale, { duration: A.anticipationMs }),
      withSpring(1, A.scaleSpring),
    );
    trailX.value = from;
    trailX.value = withDelay(A.anticipationMs + A.trailDelayMs, withSpring(to, A.trailSpring));
    trailOpacity.value = withSequence(
      withTiming(A.trailOpacity, { duration: A.anticipationMs }),
      withDelay(A.glowHoldMs, withTiming(0, { duration: A.glowOutMs })),
    );
    glow.value = withSequence(
      withTiming(1, { duration: A.glowInMs }),
      withDelay(A.glowHoldMs, withTiming(0, { duration: A.glowOutMs })),
    );
  }, [activeIndex, tabWidth, reduceMotion, x, scale, trailX, trailOpacity, glow]);

  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { scale: scale.value }],
  }));
  const trailStyle = useAnimatedStyle(() => ({
    opacity: trailOpacity.value,
    transform: [{ translateX: trailX.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  const measure = (event: LayoutChangeEvent) =>
    setTabWidth(event.nativeEvent.layout.width / TABS.length);

  const size = { width: tabWidth };

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom + theme.spacing.md }]}
      pointerEvents="box-none"
    >
      <View accessibilityRole="tablist" style={[styles.bar, style]} testID="tab-bar" {...rest}>
        <View style={styles.track} onLayout={measure} pointerEvents="none" testID="tab-bar-track">
          {tabWidth > 0 && activeIndex >= 0 ? (
            <>
              <Animated.View style={[styles.drop, size, trailStyle]} testID="tab-trail">
                <BrandGradient style={styles.fill} />
              </Animated.View>
              <Animated.View style={[styles.drop, styles.dropShadow, size, dropStyle]} testID="tab-indicator">
                <Animated.View style={[styles.fill, styles.glow, glowStyle]} />
                <BrandGradient style={styles.fill} />
              </Animated.View>
            </>
          ) : null}
        </View>
        {children}
      </View>
    </View>
  );
}
