import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import type { StudentName } from "../../schemas/schedule.schema";
import { colorAt } from "../../utils/colorAt";
import { initials } from "../../utils/initials";

import { useStyles } from "./StudentAvatars.styles";

/** Cuántos círculos se enseñan; si hay más alumnos, un último con «+N». */
export const MAX_AVATARS = 4;

interface StudentAvatarsProps {
  students: readonly StudentName[];
}

/**
 * Los alumnos de una clase como círculos solapados con sus iniciales (el
 * `-space-x-2` del prototipo), cada uno con el color de su posición en el tema.
 * Hasta 4 y, si hay más, «+N». Ocultos al lector de pantalla: la tarjeta ya dice
 * cuántos alumnos tiene.
 */
export const StudentAvatars = memo(function StudentAvatars({ students }: StudentAvatarsProps) {
  const styles = useStyles();
  const theme = useTheme();
  const shown = students.slice(0, MAX_AVATARS);
  const rest = students.length - shown.length;

  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {shown.map((student, index) => (
        <View key={index} style={[styles.circle, index > 0 && styles.overlap]} testID="student-avatar">
          <DiagonalGradient colors={colorAt(theme.clubColors, index).gradient} style={styles.fill} />
          <Text variant="avatarInitials" color="onPrimary">
            {initials(student)}
          </Text>
        </View>
      ))}
      {rest > 0 ? (
        <View style={[styles.circle, styles.overlap, styles.more]}>
          <Text variant="avatarInitials" color="text">{`+${rest}`}</Text>
        </View>
      ) : null}
    </View>
  );
});
