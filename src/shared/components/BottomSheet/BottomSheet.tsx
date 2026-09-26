import { IconLoX } from "@playtopia/icons/react-native";
import { BlurView } from "expo-blur";
import { useEffect, type ReactNode } from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBlurTarget } from "@/shared/components/BlurTarget";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./BottomSheet.styles";

// Lo que tarda en subir y en bajar (como la hoja de la app de alumnos).
const OPEN_MS = 300;
const CLOSE_MS = 250;
// El `backdrop-blur-sm` de Lovable.
const BLUR_INTENSITY = 20;
const CLOSE_ICON = 16;

export interface BottomSheetProps {
  visible: boolean;
  /** Tocar fuera, la X o el botón atrás de Android. */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Panel que sube desde abajo, el de Lovable: fondo oscuro desenfocado, tarjeta
 * con la barrita de agarre y la X. No usa `Modal`: es una capa encima de la
 * pantalla, así que va fuera del `BlurTarget` que desenfoca. Con «reducir
 * movimiento» aparece sin deslizarse (Reanimated lo respeta solo).
 */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const blurTarget = useBlurTarget();

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onClose]);

  // El contenedor siempre montado: así las capas animadas se quitan solas y
  // pueden hacer su animación de salida.
  return (
    <View style={styles.root} pointerEvents="box-none">
      {visible ? (
        <>
          <Animated.View
            entering={FadeIn.duration(OPEN_MS)}
            exiting={FadeOut.duration(CLOSE_MS)}
            style={StyleSheet.absoluteFill}
          >
            <BlurView
              intensity={BLUR_INTENSITY}
              tint="dark"
              blurMethod="dimezisBlurViewSdk31Plus"
              blurTarget={blurTarget ?? undefined}
              style={StyleSheet.absoluteFill}
            />
            <Pressable
              style={styles.overlay}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              testID="bottom-sheet-backdrop"
            />
          </Animated.View>
          <Animated.View
            entering={SlideInDown.duration(OPEN_MS)}
            exiting={SlideOutDown.duration(CLOSE_MS)}
            style={[styles.panel, { paddingBottom: styles.panel.paddingBottom + insets.bottom }]}
            accessibilityViewIsModal
          >
            <View style={styles.handle} />
            {children}
            {/* Último hijo: se pinta encima por orden, sin zIndex (se desmonta con el panel). */}
            <Pressable
              onPress={onClose}
              style={styles.close}
              hitSlop={theme.spacing.xs}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
            >
              <IconLoX size={CLOSE_ICON} color={theme.colors.text} />
            </Pressable>
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}
