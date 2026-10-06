import { View } from "react-native";

import { SectionLabel } from "@/shared/components/SectionLabel";

import { ToggleChip } from "../ToggleChip";

import { useStyles } from "./ChipGroup.styles";

/** Una opción del grupo: lo que se ve, lo que dice el lector de pantalla y si está marcada. */
export interface ChipOption<K extends string | number> {
  key: K;
  label: string;
  accessibilityLabel?: string;
  selected: boolean;
}

interface ChipGroupProps<K extends string | number> {
  /** Ya traducido: «Franja horaria»… Se pinta en mayúsculas. */
  label: string;
  options: readonly ChipOption<K>[];
  onPress: (key: K) => void;
  testID?: string;
}

/**
 * Un grupo de chips con su título: la sede, las franjas, los días y las horas
 * del editor de la disponibilidad. Quien lo usa dice qué está marcado y qué
 * pasa al tocar; el grupo solo los pinta (`ToggleChip`).
 */
export function ChipGroup<K extends string | number>({ label, options, onPress, testID }: ChipGroupProps<K>) {
  const styles = useStyles();
  return (
    <View style={styles.group} testID={testID}>
      <SectionLabel label={label} />
      <View style={styles.chips}>
        {options.map((option) => (
          <ToggleChip
            key={option.key}
            label={option.label}
            accessibilityLabel={option.accessibilityLabel}
            selected={option.selected}
            onPress={() => onPress(option.key)}
          />
        ))}
      </View>
    </View>
  );
}
