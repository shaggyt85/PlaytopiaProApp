import { View } from "react-native";

import { SectionLabel } from "@/shared/components/SectionLabel";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { WeeklyHours } from "../../schemas/weeklyHours.schema";
import { dayRangesLabel } from "../../utils/dayRangesLabel";
import { daysWithHours } from "../../utils/daysWithHours";

import { useStyles } from "./WeekSummary.styles";

/**
 * «Tu semana»: cómo queda la semana antes de guardarla, cada día con sus
 * tramos (`dayRangesLabel`). La misma en los dos modos.
 */
export function WeekSummary({ week }: { week: WeeklyHours }) {
  const styles = useStyles();
  const { t } = useTranslation();
  const days = daysWithHours(week);
  return (
    <View style={styles.week} testID="availability-week">
      <SectionLabel label={t("profile.availability.weekTitle")} />
      {days.length > 0 ? (
        days.map((day) => (
          <Text key={day} variant="caption">
            {dayRangesLabel(day, week[day] ?? [], t)}
          </Text>
        ))
      ) : (
        <Text variant="caption" color="textSecondary">
          {t("profile.availability.empty")}
        </Text>
      )}
    </View>
  );
}
