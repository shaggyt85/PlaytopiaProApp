import type { ReactNode } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./PromptSheet.styles";

/** Lo que dice el icono del círculo (`h-8 w-8`). */
const ICON = 32;

/** El botón de aceptar la oferta, con su texto ya traducido. */
export interface PromptAction {
  title: string;
  onPress: () => void | Promise<unknown>;
}

// Mientras se hace lo de aceptar, el panel no se cierra.
const noop = () => undefined;

interface PromptSheetProps {
  visible: boolean;
  /** Rechazarla: «Ahora no», la X y tocar fuera (las tres son lo mismo). */
  onDismiss: () => void;
  /**
   * Se está haciendo lo de aceptar (el diálogo del sistema abierto): el botón
   * principal enseña que trabaja, «Ahora no» no se toca y el panel no se cierra.
   */
  busy?: boolean;
  Icon: IconComponent;
  /** Ya traducido. */
  title: string;
  /** Ya traducido. */
  subtitle: string;
  primary: PromptAction;
  /** Lo propio de cada oferta entre la cabecera y los botones (las ventajas de la biometría). */
  children?: ReactNode;
  testID?: string;
}

/**
 * Un panel que ofrece algo, como el de la biometría del prototipo: el icono en
 * su círculo, el título y el subtítulo centrados, lo propio de la oferta y sus
 * botones: aceptar y «Ahora no», que pone él. Lo usan la oferta de la
 * biometría y el aviso de versión nueva.
 */
export function PromptSheet({
  visible,
  onDismiss,
  busy = false,
  Icon,
  title,
  subtitle,
  primary,
  children,
  testID,
}: PromptSheetProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <BottomSheet visible={visible} onClose={busy ? noop : onDismiss}>
      <View style={styles.header} testID={testID}>
        <View style={styles.iconCircle}>
          <Icon size={ICON} color={theme.colors.primary} />
        </View>
        <Text variant="title" align="center" accessibilityRole="header">
          {title}
        </Text>
        <Text color="textSecondary" align="center">
          {subtitle}
        </Text>
      </View>

      {children ? <View style={styles.body}>{children}</View> : null}

      <View style={styles.actions}>
        <Button title={primary.title} onPress={primary.onPress} loading={busy} />
        <Button variant="secondary" title={t("common.notNow")} onPress={onDismiss} disabled={busy} />
      </View>
    </BottomSheet>
  );
}
