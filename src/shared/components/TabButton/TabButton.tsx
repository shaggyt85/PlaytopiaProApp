import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable } from "react-native";

import { Text } from "@/shared/components/Text";
import type { TabItem } from "@/shared/config/tabs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { selectionFeedback } from "@/shared/utils/haptics";

import { useStyles } from "./TabButton.styles";

const ICON_SIZE = 20;
/** El icono activo va algo más grueso, como en el prototipo. */
const ACTIVE_STROKE = 2.4;

interface TabButtonProps extends TabTriggerSlotProps {
  tab: TabItem;
}

/**
 * Una pestaña: icono y nombre. La gota del fondo la pinta la barra. Vibra al
 * cambiar a otra pestaña, no al tocar la que ya está activa.
 */
// `style` se descarta a propósito: TabTrigger (asChild) pasa el suyo, en fila,
// y sustituiría el del botón (icono encima del nombre).
export function TabButton({ tab, isFocused = false, onPress, style: _ignored, ...rest }: TabButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const color = isFocused ? theme.colors.onPrimary : theme.colors.textSecondary;
  const { Icon } = tab;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={t(tab.label)}
      {...rest}
      style={styles.button}
      onPress={(event) => {
        if (!isFocused) selectionFeedback();
        onPress?.(event);
      }}
    >
      <Icon size={ICON_SIZE} color={color} strokeWidth={isFocused ? ACTIVE_STROKE : undefined} />
      <Text variant="tab" style={[{ color }, !isFocused && styles.inactiveLabel]} numberOfLines={1}>
        {t(tab.label)}
      </Text>
    </Pressable>
  );
}
