import { Pressable } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";

import { useStyles } from "./ToggleChip.styles";

interface ToggleChipProps {
  /** Dato de Core ya traducido: el nombre de una especialidad. */
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Si lo que se ve no se entiende solo («L»): lo que dice el lector de pantalla («Lunes»). */
  accessibilityLabel?: string;
}

/**
 * Una opción que se enciende y se apaga, como el `Pick` del prototipo: con el
 * degradado de marca si está elegida; si no, la superficie con su borde. Las
 * especialidades del perfil profesional y la sede, las franjas y los días de
 * la disponibilidad.
 */
export function ToggleChip({ label, selected, onPress, accessibilityLabel }: ToggleChipProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={styles.chip}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: selected }}
    >
      {selected ? <BrandGradient style={styles.gradient} /> : null}
      <Text variant="labelStrong" color={selected ? "onPrimary" : "text"}>
        {label}
      </Text>
    </Pressable>
  );
}
