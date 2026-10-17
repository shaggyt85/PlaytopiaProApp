import { memo, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { t } from "@/shared/config/i18n";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

import {
  bounceStarts,
  SPLASH_EASING,
  SPLASH_TIMING,
  TEXT_RISE,
  TEXT_SPRING,
  textStartMs,
} from "./AnimatedSplash.animation";
import { SPLASH_FOOTER_GAP, SPLASH_LOGO_SIZE, styles } from "./AnimatedSplash.styles";

interface AnimatedSplashProps {
  /** Ya está pintado: es el momento de ocultar el splash nativo. */
  onReady?: () => void;
  onFinish: () => void;
  duration?: number;
  /**
   * Mientras sea true, al cumplirse `duration` el splash se queda (p. ej. con
   * una actualización bajando) y se desvanece en cuanto pase a false. Una vez
   * empezado el desvanecimiento, ya no se para.
   */
  hold?: boolean;
  /** Lo que se pinta abajo, encima del fondo (la tarjeta de la actualización). */
  children?: ReactNode;
}

/** Lleva un valor a `toValue` en `duration` ms, con la curva del splash. */
const tween = (toValue: number, duration: number) =>
  withTiming(toValue, { duration, easing: SPLASH_EASING });

/**
 * Splash de marca que se monta encima de la app al abrirla:
 * el logo cae girando y rebota tres veces, aparece "PLAYTOPIA" con su lema
 * y todo se desvanece al cumplirse `duration`, o más tarde si `hold` lo retiene.
 * Con «reducir movimiento», el logo y el texto aparecen quietos en su sitio:
 * solo quedan los fundidos.
 */
export const AnimatedSplash = memo(function AnimatedSplash({
  onReady,
  onFinish,
  duration = SPLASH_TIMING.duration,
  hold = false,
  children,
}: AnimatedSplashProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  // Lo último que se sabe de `hold`, para el temporizador del final.
  const holdRef = useRef(hold);
  holdRef.current = hold;
  const timeUp = useRef(false);
  const fading = useRef(false);
  const played = useRef(false);

  // El logo arranca por encima de la pantalla; se fija al montar para que un
  // giro del dispositivo no reinicie la animación.
  const logoTranslateY = useSharedValue(-height);
  const logoScale = useSharedValue(1);
  const logoRotation = useSharedValue(0);
  const logoOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(TEXT_RISE);
  // Opaco desde el primer frame: sustituye al splash nativo (mismo `BRAND.night`)
  // sin dejar ver lo que hay debajo. Solo se desvanece al terminar.
  const backgroundOpacity = useSharedValue(1);

  // Desvanecerse y avisar. Una sola vez: empezado, ya no se para.
  const fadeOut = useCallback(() => {
    if (fading.current) return;
    fading.current = true;
    logoOpacity.value = tween(0, SPLASH_TIMING.fadeOut);
    textOpacity.value = tween(0, SPLASH_TIMING.fadeOut);
    backgroundOpacity.value = withTiming(0, { duration: SPLASH_TIMING.fadeOut, easing: SPLASH_EASING }, (finished) => {
      if (finished) scheduleOnRN(onFinish);
    });
  }, [logoOpacity, textOpacity, backgroundOpacity, onFinish]);
  const fadeOutRef = useRef(fadeOut);
  fadeOutRef.current = fadeOut;

  useEffect(() => {
    const movement: SharedValue<number>[] = [logoTranslateY, logoScale, logoRotation, textTranslateY];
    if (reduceMotion) {
      // Sin caída, giro, rebotes ni subida: todo quieto en su sitio. Si se
      // activa con la animación en marcha, se queda donde termina.
      movement.forEach((value) => cancelAnimation(value));
      logoTranslateY.value = 0;
      logoScale.value = 1;
      logoRotation.value = 0;
      textTranslateY.value = 0;
      if (!fading.current) textOpacity.value = tween(1, SPLASH_TIMING.textFadeIn);
      return;
    }
    if (played.current) return;
    played.current = true;

    const starts = bounceStarts();
    // Caída girando hasta el centro y, uno detrás de otro, los rebotes: sube
    // `altura` y vuelve.
    logoTranslateY.value = withSequence(
      tween(0, SPLASH_TIMING.fall),
      ...SPLASH_TIMING.bounces.flatMap(([altura, subida]) => [tween(-altura, subida), tween(0, subida)]),
    );
    logoRotation.value = tween(1, SPLASH_TIMING.fall);
    // El «aplastado» de escala al tocar, al empezar cada rebote.
    let at = 0;
    logoScale.value = withSequence(
      ...SPLASH_TIMING.bounces.flatMap(([, , escala, escalaIn, escalaOut], i) => {
        const wait = starts[i] - at;
        at = starts[i] + escalaIn + escalaOut;
        return [withDelay(wait, tween(escala, escalaIn)), tween(1, escalaOut)];
      }),
    );
    // El texto, al final: aparece y sube con su muelle.
    const textStart = textStartMs();
    textOpacity.value = withDelay(textStart, tween(1, SPLASH_TIMING.textFadeIn));
    textTranslateY.value = withDelay(textStart, withSpring(0, TEXT_SPRING));
  }, [reduceMotion, logoTranslateY, logoScale, logoRotation, textOpacity, textTranslateY]);

  useEffect(() => {
    // Al cumplirse `duration` se va, salvo que `hold` lo retenga.
    const finishTimer = setTimeout(() => {
      timeUp.current = true;
      if (!holdRef.current) fadeOutRef.current();
    }, duration);

    return () => {
      clearTimeout(finishTimer);
      [logoTranslateY, logoScale, logoRotation, logoOpacity, textOpacity, textTranslateY, backgroundOpacity].forEach(
        (value) => cancelAnimation(value),
      );
    };
  }, [logoTranslateY, logoScale, logoRotation, logoOpacity, textOpacity, textTranslateY, backgroundOpacity, duration]);

  // Retenido al cumplirse `duration`: se va en cuanto se suelta.
  useEffect(() => {
    if (timeUp.current && !hold) fadeOut();
  }, [hold, fadeOut]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: backgroundOpacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoTranslateY.value },
      { scale: logoScale.value },
      { rotate: `${logoRotation.value * 360}deg` },
    ],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      accessible
      accessibilityLabel={`PLAYTOPIA. ${t("splash.tagline")}`}
      testID="animated-splash"
      onLayout={onReady}
    >
      <BrandBackground>
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoStyle]} testID="splash-logo">
            <BrandLogo size={SPLASH_LOGO_SIZE} />
          </Animated.View>

          <Animated.View style={[styles.textContainer, textStyle]} testID="splash-text">
            {/* Nombre de marca: no se traduce */}
            <Text style={styles.title}>PLAYTOPIA</Text>
            <View style={styles.subtitle}>
              <Text style={styles.subtitleText}>{t("splash.tagline")}</Text>
            </View>
          </Animated.View>
        </View>

        {children ? (
          <View style={[styles.footer, { bottom: insets.bottom + SPLASH_FOOTER_GAP }]}>{children}</View>
        ) : null}
      </BrandBackground>
    </Animated.View>
  );
});
