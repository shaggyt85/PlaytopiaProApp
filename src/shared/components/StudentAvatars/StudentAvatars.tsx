import { memo } from "react";
import { View } from "react-native";

import { StudentAvatar } from "@/shared/components/StudentAvatar";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";

import { useStyles } from "./StudentAvatars.styles";

/** Cuántos círculos caben; si hay más alumnos, uno menos y el «+N». */
export const MAX_AVATARS = 4;

interface StudentAvatarsProps {
  students: readonly ClassStudent[];
  /** Las plazas de la clase: sin «+N», se completan con huecos libres hasta ellas (y hasta 4). */
  capacity?: number;
}

/**
 * Los alumnos de una clase como círculos solapados con sus iniciales (el
 * `-space-x-1.5` del prototipo), cada uno con el color de su posición y, si
 * viene a recuperar, con su «R». Hasta 4; si hay más, 3 y «+N», como el
 * prototipo. Ocultos al lector de pantalla: la tarjeta ya dice cuántos alumnos
 * tiene y cuántos recuperan. Con `capacity`, las plazas libres van como huecos
 * («Mis grupos»).
 */
export const StudentAvatars = memo(function StudentAvatars({ students, capacity }: StudentAvatarsProps) {
  const styles = useStyles();
  const shown = students.slice(0, students.length <= MAX_AVATARS ? MAX_AVATARS : MAX_AVATARS - 1);
  const rest = students.length - shown.length;
  const free = rest > 0 || capacity === undefined ? 0 : Math.max(0, Math.min(capacity, MAX_AVATARS) - shown.length);

  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {shown.map((student, index) => (
        <StudentAvatar
          key={index}
          student={student}
          index={index}
          recovery={student.is_recovery}
          size="sm"
          ring
          style={index > 0 && styles.overlap}
        />
      ))}
      {rest > 0 ? <StudentAvatar more={rest} size="sm" ring style={styles.overlap} /> : null}
      {Array.from({ length: free }, (_, i) => (
        <StudentAvatar key={`free-${i}`} empty size="sm" style={(shown.length > 0 || i > 0) && styles.overlap} />
      ))}
    </View>
  );
});
