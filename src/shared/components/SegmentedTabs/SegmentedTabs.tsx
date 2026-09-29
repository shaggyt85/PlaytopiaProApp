import { Pressable, View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import {
  COMPACT_TAB_HEIGHT,
  LABEL_VARIANT,
  TAB_ICON_SIZE,
  useStyles,
  type SegmentedTabsVariant,
} from "./SegmentedTabs.styles";

export interface SegmentedTabOption<K extends string> {
  key: K;
  /** Texto ya traducido. */
  label: string;
  Icon?: IconComponent;
}

interface SegmentedTabsProps<K extends string> {
  options: readonly SegmentedTabOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** `full` (por defecto): a todo el ancho, «Red de clubes». `compact`: pequeño, la agenda. */
  variant?: SegmentedTabsVariant;
  testID?: string;
}

/**
 * Selector de pestañas dentro de una pantalla (el del prototipo): una píldora
 * con una opción por pestaña y la activa con el degradado de marca. No guarda
 * nada: la pestaña elegida la lleva quien lo usa. Pulsar la activa no avisa.
 *
 * El tamaño `compact` mide menos que el área táctil mínima: cada opción la
 * completa con `hitSlop`, como `IconButton`.
 */
export function SegmentedTabs<K extends string>({
  options,
  value,
  onChange,
  variant = "full",
  testID,
}: SegmentedTabsProps<K>) {
  const styles = useStyles();
  const theme = useTheme();
  const hitSlop = variant === "compact" ? (theme.touchTarget - COMPACT_TAB_HEIGHT) / 2 : undefined;

  return (
    <View style={styles[variant]} accessibilityRole="tablist" testID={testID}>
      {options.map(({ key, label, Icon }) => {
        const selected = key === value;
        const color = selected ? "onPrimary" : "textSecondary";
        return (
          <Pressable
            key={key}
            onPress={() => !selected && onChange(key)}
            hitSlop={hitSlop}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
            style={[styles[`${variant}Tab`], selected && styles[`${variant}Active`]]}
            testID={testID ? `${testID}-${key}` : undefined}
          >
            {selected ? <BrandGradient style={styles[`${variant}Fill`]} /> : null}
            <View style={styles[`${variant}Content`]}>
              {Icon ? <Icon size={TAB_ICON_SIZE} color={theme.colors[color]} /> : null}
              <Text variant={LABEL_VARIANT[variant]} color={color} numberOfLines={1} style={styles.label}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
