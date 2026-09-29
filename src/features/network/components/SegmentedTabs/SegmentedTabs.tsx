import { Pressable, View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import type { IconComponent } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";

import { TAB_ICON_SIZE, useStyles } from "./SegmentedTabs.styles";

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
  testID?: string;
}

/**
 * Selector de pestañas dentro de una pantalla (el del prototipo): una píldora
 * con una opción por pestaña y la activa con el degradado de marca. No guarda
 * nada: la pestaña elegida la lleva quien lo usa. Pulsar la activa no avisa.
 */
export function SegmentedTabs<K extends string>({ options, value, onChange, testID }: SegmentedTabsProps<K>) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="tablist" testID={testID}>
      {options.map(({ key, label, Icon }) => {
        const selected = key === value;
        const color = selected ? "onPrimary" : "textSecondary";
        return (
          <Pressable
            key={key}
            onPress={() => !selected && onChange(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
            style={[styles.tab, selected && styles.active]}
            testID={testID ? `${testID}-${key}` : undefined}
          >
            {selected ? <BrandGradient style={styles.fill} /> : null}
            <View style={styles.content}>
              {Icon ? <Icon size={TAB_ICON_SIZE} color={theme.colors[color]} /> : null}
              <Text variant="mark" color={color} numberOfLines={1} style={styles.label}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
