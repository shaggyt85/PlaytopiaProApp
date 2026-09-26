import { memo, useEffect, useRef } from "react";
import {
  Animated,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { t } from "@/shared/config/i18n";

import { SPLASH_LOGO_SIZE, styles } from "./AnimatedSplash.styles";

interface AnimatedSplashProps {
  onFinish: () => void;
  duration?: number;
}

/**
 * Splash de marca que se monta encima de la app al abrirla:
 * el logo cae girando y rebota tres veces, aparece "PLAYTOPIA" con su lema
 * y todo se desvanece al cumplirse `duration`.
 */
export const AnimatedSplash = memo(function AnimatedSplash({
  onFinish,
  duration = 3000,
}: AnimatedSplashProps) {
  const { height } = useWindowDimensions();

  // El logo arranca por encima de la pantalla; se fija al montar para que un
  // giro del dispositivo no reinicie la animación.
  const logoTranslateY = useRef(new Animated.Value(-height)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let textTimeout: ReturnType<typeof setTimeout> | undefined;

    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

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
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      rebote(80, 400, 1.3, 100, 300),
      rebote(40, 250, 1.15, 80, 170),
      rebote(15, 200, 1.08, 80, 120),
      Animated.delay(300),
    ]).start(({ finished }) => {
      // Si se desmonta a mitad, stopAnimation() llega aquí con finished=false:
      // no hay que programar nada más.
      if (!finished) return;
      textTimeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(textTranslateY, {
            toValue: 0,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          }),
        ]).start();
      }, 500);
    });

    const finishTimer = setTimeout(() => {
      Animated.parallel(
        [logoOpacity, textOpacity, backgroundOpacity].map((value) =>
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ),
      ).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, duration);

    return () => {
      clearTimeout(finishTimer);
      if (textTimeout) clearTimeout(textTimeout);
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
    onFinish,
    duration,
  ]);

  return (
    <Animated.View
      style={[styles.container, { opacity: backgroundOpacity }]}
      accessible
      accessibilityLabel={`PLAYTOPIA. ${t("splash.tagline")}`}
      testID="animated-splash"
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

      </BrandBackground>
    </Animated.View>
  );
});
