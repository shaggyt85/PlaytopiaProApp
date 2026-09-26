import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/shared/components/Screen";
import { Text } from "@/shared/components/Text";
import { BRAND_ASSETS } from "@/shared/config/assets";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./AuthLayout.styles";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  testID?: string;
}

/**
 * Marco común de todas las pantallas del flujo de acceso: degradado de marca,
 * logo, título y el formulario centrado, que sube con el teclado.
 */
export function AuthLayout({ title, subtitle, children, testID }: AuthLayoutProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Screen testID={testID}>
      <LinearGradient
        colors={theme.gradients.brand}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                source={BRAND_ASSETS.logoWhite}
                style={styles.logo}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <Text variant="title" align="center" accessibilityRole="header">
                {title}
              </Text>
              {subtitle ? (
                <Text color="textSecondary" align="center">
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
