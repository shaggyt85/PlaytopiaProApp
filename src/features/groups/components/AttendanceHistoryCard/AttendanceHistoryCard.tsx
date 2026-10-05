import { IconLoAlertTriangle } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { IconText } from "@/shared/components/IconText";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import type { StudentAttendance } from "../../schemas/groupAttendance.schema";
import { attendanceAlertText } from "../../utils/attendanceAlertText";
import { AttendanceDot } from "../AttendanceDot";

import { useStyles } from "./AttendanceHistoryCard.styles";

/**
 * «Asistencia» en la ficha de un alumno, como el prototipo: «Últimas 10
 * clases», «7/10 clases», un círculo ✓/✗ por clase con su fecha, de la más
 * antigua a la más reciente, y el aviso de sus faltas en oro si lo hay. Todo
 * tal como lo manda Core: aquí no se cuenta ni se decide nada. La fila se lee
 * de una vez («Vino a 7 de 10 clases, 2 ausencias seguidas»).
 */
export function AttendanceHistoryCard({ attendance }: { attendance: StudentAttendance }) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { recent, present, alert } = attendance;
  const total = recent.length;
  const alertText = alert ? attendanceAlertText(alert, t) : null;

  return (
    <View style={styles.card} testID="attendance-history">
      <View style={styles.top}>
        <SectionLabel label={t("groups.student.attendance")} />
        <Text variant="small" color="textSecondary">
          {t("groups.student.lastClasses", { count: total })}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={joinParts([t("groups.student.attendanceA11y", { present, count: total }), alertText], ", ")}
      >
        <View style={styles.total}>
          <Text variant="subtitle">{`${present}/${total}`}</Text>
          <Text variant="small" color="textSecondary">
            {t("groups.student.classes", { count: total })}
          </Text>
        </View>
        <View style={styles.dots}>
          {recent.map((entry) => (
            <AttendanceDot key={entry.class_id} entry={entry} />
          ))}
        </View>
        {alertText ? (
          <View style={styles.alert} testID="attendance-alert">
            <IconText Icon={IconLoAlertTriangle} label={alertText} size="hero" tint={theme.accents.gold.color} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
