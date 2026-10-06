import { Pressable } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";

import { useStyles } from "./ToggleChip.styles";

interface ToggleChipProps {
  /** Dato de Core ya traducido: el nombre de una especialidad. */
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * Una opción que se enciende y se apaga, como el `Pick` del prototipo: con el
 * degradado de marca si está elegida; si no, la superficie con su borde.
 */
export function ToggleChip({ label, selected, onPress }: ToggleChipProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={styles.chip}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
    >
      {selected ? <BrandGradient style={styles.gradient} /> : null}
      <Text variant="labelStrong" color={selected ? "onPrimary" : "text"}>
        {label}
      </Text>
    </Pressable>
  );
}
