import type { ReactNode } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppScrollView } from "@/shared/components/AppScrollView";
import { BackButton } from "@/shared/components/BackButton";
import { BrandBackground } from "@/shared/components/BrandBackground";
import { LogoSection } from "@/shared/components/LogoSection";
import { KEYBOARD_AVOIDING_BEHAVIOR } from "@/shared/config/keyboard";

import { useStyles } from "./AuthLayout.styles";

interface AuthLayoutProps {
  children: ReactNode;
  /** Texto pegado bajo la versión (p. ej. el correo en la contraseña). */
  subtitle?: string;
  /** Muestra el botón de volver (todas menos la primera pantalla). */
  showBackButton?: boolean;
  /** Cabecera con logo y versión. El registro no la lleva, como en la app de alumnos. */
  showLogo?: boolean;
  testID?: string;
}

/**
 * Marco de todas las pantallas de acceso, igual que en la app de alumnos:
 * fondo de marca, cabecera con logo, "Playtopia Pro" y versión, y el formulario
 * centrado que sube con el teclado.
 */
export function AuthLayout({
  children,
  subtitle,
  showBackButton = false,
  showLogo = true,
  testID,
}: AuthLayoutProps) {
  const styles = useStyles();

  return (
    <BrandBackground testID={testID}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={KEYBOARD_AVOIDING_BEHAVIOR}
        >
          <AppScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              {showLogo ? <LogoSection subtitle={subtitle} /> : null}
              {children}
            </View>
          </AppScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* Último hijo: se pinta encima por orden, sin zIndex. */}
      {showBackButton ? <BackButton /> : null}
    </BrandBackground>
  );
}
