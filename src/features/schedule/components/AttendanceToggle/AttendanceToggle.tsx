import { Pressable } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { ATTENDANCE_ICON } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import type { AttendanceStatus } from "@/shared/schemas/schedule.schema";

import { TOGGLE_ICON_SIZE, TOGGLE_SIZE, useStyles } from "./AttendanceToggle.styles";

interface AttendanceToggleProps {
  /** La marca que pone: ✓ presente o ✗ ausente. */
  status: AttendanceStatus;
  /** Si es la marca que tiene el alumno. */
  selected: boolean;
  /** Ya pasó el plazo: se ve atenuado y al tocarlo se dice por qué no cambia. */
  locked?: boolean;
  onPress: () => void;
  /** Ya traducido: «Marcar presente a Lucía Romero». */
  accessibilityLabel: string;
}

/**
 * Un botón de la asistencia de un alumno, como el prototipo: el cuadrado gris
 * con ✓ o ✗ y, si es su marca, en relieve con el degradado de marca (presente)
 * o el coral (ausente). Pasado el plazo (`locked`) se sigue viendo la marca,
 * atenuada, y se puede tocar para que se diga por qué ya no cambia. El lector
 * de pantalla dice si está elegido.
 */
export function AttendanceToggle({ status, selected, locked = false, onPress, accessibilityLabel }: AttendanceToggleProps) {
  const styles = useStyles();
  const theme = useTheme();
  const Icon = ATTENDANCE_ICON[status];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={(theme.touchTarget - TOGGLE_SIZE) / 2}
      style={({ pressed }) => [
        styles.box,
        selected && styles[status],
        locked && styles.locked,
        pressed && !locked && styles.pressed,
      ]}
      testID={`attendance-${status}`}
    >
      {selected && status === "present" ? <BrandGradient style={styles.fill} /> : null}
      {selected && status === "absent" ? (
        <DiagonalGradient colors={theme.accents.coral.gradient} style={styles.fill} />
      ) : null}
      <Icon size={TOGGLE_ICON_SIZE} color={selected ? theme.colors.onPrimary : theme.colors.textSecondary} />
    </Pressable>
  );
}
