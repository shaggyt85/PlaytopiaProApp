import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import type { ChosenSport, TeacherSport } from "@/shared/schemas/teacherProfile.schema";

import { isChosen, toggleSpecialty } from "../../utils/toggleSpecialty";
import { ToggleChip } from "../ToggleChip";

import { useStyles } from "./SpecialtyPicker.styles";

interface SpecialtyPickerProps {
  /** Lo que se puede elegir, en el orden del catálogo. */
  catalog: readonly TeacherSport[];
  value: readonly ChosenSport[];
  onChange: (value: ChosenSport[]) => void;
}

/**
 * Las especialidades del catálogo, un deporte debajo de otro, cada una un chip
 * que se enciende y se apaga (`toggleSpecialty`). Un deporte sin especialidades
 * se elige con su propio chip.
 */
export function SpecialtyPicker({ catalog, value, onChange }: SpecialtyPickerProps) {
  const styles = useStyles();
  return (
    <View style={styles.sports}>
      {catalog.map((sport) => {
        const options =
          sport.specialties.length > 0
            ? sport.specialties.map((s) => ({ code: s.code as string | null, name: s.name }))
            : [{ code: null, name: sport.name }];
        return (
          <View key={sport.code} style={styles.sport} testID={`sport-${sport.code}`}>
            <Text variant="rowLabel">{sport.name}</Text>
            <View style={styles.chips}>
              {options.map((option) => (
                <ToggleChip
                  key={option.code ?? sport.code}
                  label={option.name}
                  selected={isChosen(value, sport.code, option.code)}
                  onPress={() => onChange(toggleSpecialty(value, sport.code, option.code))}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
