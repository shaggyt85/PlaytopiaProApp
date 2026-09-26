import type { TabTriggerSlotProps } from "expo-router/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";

import { Text } from "@/shared/components/Text";
import type { TabItem } from "@/shared/config/tabs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./TabButton.styles";

const ICON_SIZE = 20;
/** El icono activo va algo más grueso, como en el prototipo. */
const ACTIVE_STROKE = 2.4;

interface TabButtonProps extends TabTriggerSlotProps {
  tab: TabItem;
}

/** Una pestaña: icono y nombre; la activa, sobre el degradado de marca. */
export function TabButton({ tab, isFocused = false, ...rest }: TabButtonProps) {
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
      style={styles.button}
      {...rest}
    >
      {isFocused ? (
        <LinearGradient
          colors={theme.gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.active}
          testID="tab-active-background"
        />
      ) : null}
      <Icon size={ICON_SIZE} color={color} strokeWidth={isFocused ? ACTIVE_STROKE : undefined} />
      <Text variant="tab" style={[{ color }, !isFocused && styles.inactiveLabel]} numberOfLines={1}>
        {t(tab.label)}
      </Text>
    </Pressable>
  );
}
