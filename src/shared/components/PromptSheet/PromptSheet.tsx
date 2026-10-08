import type { ReactNode } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./PromptSheet.styles";

/** Lo que dice el icono del círculo (`h-8 w-8`). */
const ICON = 32;

/** Un botón del panel, con su texto ya traducido. */
export interface PromptAction {
  title: string;
  onPress: () => void | Promise<unknown>;
  loading?: boolean;
  disabled?: boolean;
}

interface PromptSheetProps {
  visible: boolean;
  /** La X y tocar fuera. */
  onClose: () => void;
  Icon: IconComponent;
  /** Ya traducido. */
  title: string;
  /** Ya traducido. */
  subtitle: string;
  primary: PromptAction;
  /** El de rechazar («Ahora no»), con borde. */
  secondary?: PromptAction;
  /** Lo propio de cada oferta entre la cabecera y los botones (las ventajas de la biometría). */
  children?: ReactNode;
  testID?: string;
}

/**
 * Un panel que ofrece algo, como el de la biometría del prototipo: el icono en
 * su círculo, el título y el subtítulo centrados, lo propio de la oferta y sus
 * botones. Lo usan la oferta de la biometría y el aviso de versión nueva.
 */
export function PromptSheet({
  visible,
  onClose,
  Icon,
  title,
  subtitle,
  primary,
  secondary,
  children,
  testID,
}: PromptSheetProps) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
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
        <Button
          title={primary.title}
          onPress={primary.onPress}
          loading={primary.loading}
          disabled={primary.disabled}
        />
        {secondary ? (
          <Button
            variant="secondary"
            title={secondary.title}
            onPress={secondary.onPress}
            loading={secondary.loading}
            disabled={secondary.disabled}
          />
        ) : null}
      </View>
    </BottomSheet>
  );
}
