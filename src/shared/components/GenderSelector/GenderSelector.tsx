import { Pressable, View } from "react-native";

import { Checkbox } from "@/shared/components/Checkbox";
import { FormField } from "@/shared/components/FormField";
import { Text } from "@/shared/components/Text";
import { GENDER, GENDER_OPTIONS, type Gender } from "@/shared/config/gender";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./GenderSelector.styles";

interface GenderSelectorProps {
  value: Gender;
  onChange: (value: Gender) => void;
  /** Mensaje de error ya traducido. */
  error?: string;
}

/**
 * Género como en la app de alumnos: un botón por opción de `GENDER_OPTIONS` y
 * la casilla "Prefiero no decirlo" debajo.
 */
export function GenderSelector({ value, onChange, error }: GenderSelectorProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const hidden = value === GENDER.NONE;

  return (
    <FormField label={t("gender.label")} error={error}>
      <View style={styles.options}>
        {GENDER_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text color={selected ? "text" : "option"}>{t(option.label)}</Text>
            </Pressable>
          );
        })}
      </View>
      <Checkbox
        checked={hidden}
        onChange={(checked) => onChange(checked ? GENDER.NONE : GENDER.MALE)}
        tone="option"
      >
        {t("gender.preferNotToSay")}
      </Checkbox>
    </FormField>
  );
}
