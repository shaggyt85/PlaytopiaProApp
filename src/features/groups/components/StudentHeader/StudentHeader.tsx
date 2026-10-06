import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { StudentAvatar } from "@/shared/components/StudentAvatar";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";
import { formatLevel } from "@/shared/utils/formatLevel";
import { fullName } from "@/shared/utils/fullName";

import { DetailBack } from "../DetailBack";

import { useStyles } from "./StudentHeader.styles";

interface StudentHeaderProps {
  student: ClassStudent;
  /** Su posición en «Alumnos del grupo»: de ella sale su color, el mismo que en la lista. */
  index: number;
  onBack: () => void;
}

/**
 * La cabecera de la ficha de un alumno, como el prototipo: ‹, su círculo
 * grande, su nombre y su nivel en la sede del grupo en una pastilla magenta con
 * brillo. Sin matrícula en la sede no tiene nivel, y no se enseña.
 */
export function StudentHeader({ student, index, onBack }: StudentHeaderProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const level = formatLevel(student.level);

  return (
    <View>
      <DetailBack onPress={onBack} />
      <View style={styles.row}>
        <StudentAvatar student={student} index={index} size="lg" />
        <View style={styles.texts}>
          <Text variant="title" accessibilityRole="header" numberOfLines={1}>
            {fullName(student)}
          </Text>
          {level ? (
            <View style={styles.level} accessible accessibilityLabel={t("schedule.next.level", { range: level })}>
              <Text variant="segment" color="textSecondary">
                {t("groups.student.level")}
              </Text>
              <View style={styles.badge} testID="student-level">
                <DiagonalGradient colors={theme.gradients.levelBadge} style={styles.badgeFill} />
                <Text variant="subtitle">{level}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
