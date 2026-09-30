import { memo } from "react";
import { View } from "react-native";

import type { StudentName } from "../../schemas/schedule.schema";
import { StudentAvatar } from "../StudentAvatar";

import { useStyles } from "./StudentAvatars.styles";

/** Cuántos círculos se enseñan; si hay más alumnos, un último con «+N». */
export const MAX_AVATARS = 4;

interface StudentAvatarsProps {
  students: readonly StudentName[];
}

/**
 * Los alumnos de una clase como círculos solapados con sus iniciales (el
 * `-space-x-2` del prototipo), cada uno con el color de su posición. Hasta 4 y,
 * si hay más, «+N». Ocultos al lector de pantalla: la tarjeta ya dice cuántos
 * alumnos tiene.
 */
export const StudentAvatars = memo(function StudentAvatars({ students }: StudentAvatarsProps) {
  const styles = useStyles();
  const shown = students.slice(0, MAX_AVATARS);
  const rest = students.length - shown.length;

  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {shown.map((student, index) => (
        <StudentAvatar
          key={index}
          student={student}
          index={index}
          size="sm"
          ring
          style={index > 0 && styles.overlap}
        />
      ))}
      {rest > 0 ? <StudentAvatar more={rest} size="sm" ring style={styles.overlap} /> : null}
    </View>
  );
});
