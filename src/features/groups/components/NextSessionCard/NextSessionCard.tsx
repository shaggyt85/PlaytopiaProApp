import { View } from "react-native";

import { Chevron } from "@/shared/components/Chevron";
import { PressableScale } from "@/shared/components/PressableScale";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { formatClassDate, formatClubTime } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";
import { splitRecoveries } from "@/shared/utils/splitRecoveries";

import { useStyles } from "./NextSessionCard.styles";

interface NextSessionCardProps {
  next: ScheduleClass;
  /** Abre su detalle. */
  onPress: () => void;
}

/**
 * «Próxima clase» del grupo, como el prototipo: su día y su hora («Lunes, 18 de
 * noviembre · 16:00»), cuántos del grupo hay inscritos y, en oro, cuántos
 * vienen a recuperar, y cuántos alumnos se esperan en total. Al tocarla, su
 * detalle, con su asistencia.
 */
export function NextSessionCard({ next, onPress }: NextSessionCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { members, recoveries } = splitRecoveries(next.students);
  const when = joinParts([formatClassDate(next.class_date), formatClubTime(next.class_time)]);
  const enrolled = t("groups.detail.enrolled", { count: members.length });
  const recovering = recoveries.length > 0 ? t("schedule.next.recoveries", { count: recoveries.length }) : null;
  const expected = t("groups.detail.expected", { count: next.students.length });

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={joinParts([t("groups.detail.nextClass"), when, enrolled, recovering, expected], ", ")}
      accessibilityHint={t("schedule.detail.openHint")}
      style={styles.card}
      testID="next-session"
    >
      <SectionLabel label={t("groups.detail.nextClass")} />
      <View style={styles.row}>
        <View style={styles.texts}>
          <Text variant="strong">{when}</Text>
          <Text variant="small" color="textSecondary" style={styles.enrolled}>
            {enrolled}
            {recovering ? (
              <Text variant="small" style={{ color: theme.accents.gold.color }}>{` · ${recovering}`}</Text>
            ) : null}
          </Text>
          <Text variant="labelStrong">{expected}</Text>
        </View>
        <Chevron />
      </View>
    </PressableScale>
  );
}
