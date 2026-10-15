import { memo, useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  Animated,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { t } from "@/shared/config/i18n";

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

/**
 * Tiempos de la animación (ms). Todo tiene que caber en `duration` (3 s):
 * caída 500 + rebotes 1060 + pausa 100 = el texto aparece a los 1,66 s y se
 * ve completo desde los 2,26 s hasta que todo se desvanece a los 3 s.
 */
export const SPLASH_TIMING = {
  duration: 3000,
  fall: 500,
  /** [altura, subida, escala, escalaIn, escalaOut] de cada rebote */
  bounces: [
    [80, 250, 1.3, 80, 200],
    [40, 160, 1.15, 60, 120],
    [15, 120, 1.08, 50, 90],
  ] as const,
  pauseBeforeText: 100,
  textFadeIn: 600,
  fadeOut: 400,
};

/**
 * Splash de marca que se monta encima de la app al abrirla:
 * el logo cae girando y rebota tres veces, aparece "PLAYTOPIA" con su lema
 * y todo se desvanece al cumplirse `duration`, o más tarde si `hold` lo retiene.
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
  // Lo último que se sabe de `hold`, para el temporizador del final.
  const holdRef = useRef(hold);
  holdRef.current = hold;
  const timeUp = useRef(false);
  const fading = useRef(false);

  // El logo arranca por encima de la pantalla; se fija al montar para que un
  // giro del dispositivo no reinicie la animación.
  const logoTranslateY = useRef(new Animated.Value(-height)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current;
  // Opaco desde el primer frame: sustituye al splash nativo (mismo `BRAND.night`)
  // sin dejar ver lo que hay debajo. Solo se desvanece al terminar.
  const backgroundOpacity = useRef(new Animated.Value(1)).current;

  // Desvanecerse y avisar. Una sola vez: empezado, ya no se para.
  const fadeOut = useCallback(() => {
    if (fading.current) return;
    fading.current = true;
    Animated.parallel(
      [logoOpacity, textOpacity, backgroundOpacity].map((value) =>
        Animated.timing(value, {
          toValue: 0,
          duration: SPLASH_TIMING.fadeOut,
          useNativeDriver: true,
        }),
      ),
    ).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [logoOpacity, textOpacity, backgroundOpacity, onFinish]);
  const fadeOutRef = useRef(fadeOut);
  fadeOutRef.current = fadeOut;

  useEffect(() => {
    // Un rebote: sube `altura` y vuelve, con un "aplastado" de escala al tocar.
    const rebote = (
      altura: number,
      subida: number,
      escala: number,
      escalaIn: number,
      escalaOut: number,
    ) =>
      Animated.parallel([
        Animated.sequence([
          Animated.timing(logoTranslateY, {
            toValue: -altura,
            duration: subida,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateY, {
            toValue: 0,
            duration: subida,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: escala,
            duration: escalaIn,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: escalaOut,
            useNativeDriver: true,
          }),
        ]),
      ]);

    Animated.sequence([
      // Caída girando hasta el centro
      Animated.parallel([
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: SPLASH_TIMING.fall,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: SPLASH_TIMING.fall,
          useNativeDriver: true,
        }),
      ]),
      ...SPLASH_TIMING.bounces.map(([altura, subida, escala, escalaIn, escalaOut]) =>
        rebote(altura, subida, escala, escalaIn, escalaOut),
      ),
      Animated.delay(SPLASH_TIMING.pauseBeforeText),
      // El texto es el último paso de la misma secuencia (sin temporizadores
      // aparte que limpiar al desmontar).
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: SPLASH_TIMING.textFadeIn,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Al cumplirse `duration` se va, salvo que `hold` lo retenga.
    const finishTimer = setTimeout(() => {
      timeUp.current = true;
      if (!holdRef.current) fadeOutRef.current();
    }, duration);

    return () => {
      clearTimeout(finishTimer);
      [
        logoTranslateY,
        logoScale,
        logoRotation,
        logoOpacity,
        textOpacity,
        textTranslateY,
        backgroundOpacity,
      ].forEach((value) => value.stopAnimation());
    };
  }, [
    logoTranslateY,
    logoScale,
    logoRotation,
    logoOpacity,
    textOpacity,
    textTranslateY,
    backgroundOpacity,
    duration,
  ]);

  // Retenido al cumplirse `duration`: se va en cuanto se suelta.
  useEffect(() => {
    if (timeUp.current && !hold) fadeOut();
  }, [hold, fadeOut]);

  return (
    <Animated.View
      style={[styles.container, { opacity: backgroundOpacity }]}
      accessible
      accessibilityLabel={`PLAYTOPIA. ${t("splash.tagline")}`}
      testID="animated-splash"
      onLayout={onReady}
    >
      <BrandBackground>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { translateY: logoTranslateY },
                  { scale: logoScale },
                  {
                    rotate: logoRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <BrandLogo size={SPLASH_LOGO_SIZE} />
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
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
