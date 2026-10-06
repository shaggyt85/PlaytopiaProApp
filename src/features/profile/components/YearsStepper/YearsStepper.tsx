import { Pressable, View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { EXPERIENCE_YEARS_MAX } from "../../schemas/professional.schema";

import { useStyles } from "./YearsStepper.styles";

interface YearsStepperProps {
  /** `null` si aún no lo ha dicho: se ve «—» y «+» empieza en 1. */
  value: number | null;
  onChange: (value: number) => void;
}

/**
 * Los años de experiencia con − y +, como el prototipo (el signo como texto),
 * sin bajar de 0 ni pasar de `EXPERIENCE_YEARS_MAX`.
 */
export function YearsStepper({ value, onChange }: YearsStepperProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const canDecrease = value !== null && value > 0;
  const canIncrease = value === null || value < EXPERIENCE_YEARS_MAX;
  const steps = [
    { sign: "−", label: t("profile.professional.fewerYears"), enabled: canDecrease, next: (value ?? 0) - 1 },
    { sign: "+", label: t("profile.professional.moreYears"), enabled: canIncrease, next: (value ?? 0) + 1 },
  ];
  const [decrease, increase] = steps.map((step) => (
    <Pressable
      key={step.sign}
      onPress={() => onChange(step.next)}
      disabled={!step.enabled}
      style={[styles.step, !step.enabled && styles.disabled]}
      accessibilityRole="button"
      accessibilityLabel={step.label}
      accessibilityState={{ disabled: !step.enabled }}
    >
      <Text variant="subtitle">{step.sign}</Text>
    </Pressable>
  ));
  return (
    <View style={styles.row}>
      {decrease}
      <Text variant="title" style={styles.value} testID="years-value">
        {value ?? "—"}
      </Text>
      {increase}
    </View>
  );
}
