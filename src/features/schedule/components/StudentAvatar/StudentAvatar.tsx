import { View, type StyleProp, type ViewStyle } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";

import type { StudentName } from "../../schemas/schedule.schema";
import { colorAt } from "../../utils/colorAt";
import { initials } from "../../utils/initials";

import { AVATAR_SIZES, useStyles, type StudentAvatarSize } from "./StudentAvatar.styles";

type StudentAvatarProps = {
  /** `sm` (32) en los círculos solapados de la próxima clase; `md` (44) en la lista del detalle. */
  size: StudentAvatarSize;
  /** El aro del fondo que lo separa del de al lado (`ring-2 ring-background`). */
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
} & (
  | {
      student: StudentName;
      /** Su posición en la lista (ya ordenada por el contrato): de ella sale su color. */
      index: number;
    }
  | {
      /** Cuántos alumnos más hay: el círculo «+N». */
      more: number;
    }
);

/**
 * El círculo de un alumno con sus iniciales y el degradado de su posición
 * (`colorAt`), o el «+N» de los que no caben. Único sitio que lo dibuja: los
 * círculos de la próxima clase y la lista de alumnos del detalle.
 */
export function StudentAvatar(props: StudentAvatarProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { size, ring = false, style } = props;
  const { variant } = AVATAR_SIZES[size];
  const isMore = "more" in props;

  return (
    <View style={[styles[size], ring && styles.ring, isMore && styles.more, style]} testID={isMore ? "student-avatar-more" : "student-avatar"}>
      {isMore ? null : (
        <DiagonalGradient colors={colorAt(theme.clubColors, props.index).gradient} style={styles.fill} />
      )}
      <Text variant={variant} color={isMore ? "text" : "onPrimary"}>
        {isMore ? `+${props.more}` : initials(props.student)}
      </Text>
    </View>
  );
}
