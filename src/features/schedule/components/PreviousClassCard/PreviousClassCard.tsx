import { IconLoChevronRight } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { PressableScale } from "@/shared/components/PressableScale";
import { StudentAvatars } from "@/shared/components/StudentAvatars";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import { withAlpha } from "@/shared/utils/color";
import { capitalize, formatWeekdayShortDayMonth } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import { attendanceSummary } from "../../utils/attendanceSummary";

import { CHEVRON_SIZE, useStyles } from "./PreviousClassCard.styles";

interface PreviousClassCardProps {
  item: ScheduleClass;
  /** Abre la lista de esa clase. */
  onPress: () => void;
}

/**
 * La última clase del grupo, en el detalle de una clase, como el prototipo: su
 * título y su día («Lun 11 sept»), «Asistencia 3/3», los círculos de sus
 * alumnos y cuántos eran. Se lee de una vez y, al tocarla, abre su lista.
 */
export function PreviousClassCard({ item, onPress }: PreviousClassCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { present, total } = attendanceSummary(item.students);
  const day = capitalize(formatWeekdayShortDayMonth(item.class_date));
  const attendance = t("schedule.detail.lastClassAttendance", { present, total });
  const count = t("schedule.detail.studentCount", { count: total });

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={joinParts([item.title, day, attendance, count], ", ")}
      accessibilityHint={t("schedule.detail.lastClassHint")}
      style={styles.card}
      testID="previous-class"
    >
      <View style={styles.top}>
        <Text variant="smallTitle" numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <View style={styles.date}>
          <Text variant="timeBadge" color="textSecondary">
            {day}
          </Text>
        </View>
      </View>
      <Text variant="metaStrong" color="textSecondary" style={styles.attendance}>
        {attendance}
      </Text>
      <View style={styles.students}>
        <StudentAvatars students={item.students} />
        <Text variant="metaStrong" color="textSecondary" style={styles.count}>
          {count}
        </Text>
        <IconLoChevronRight size={CHEVRON_SIZE} color={withAlpha(theme.colors.textSecondary, 0.6)} />
      </View>
    </PressableScale>
  );
}
