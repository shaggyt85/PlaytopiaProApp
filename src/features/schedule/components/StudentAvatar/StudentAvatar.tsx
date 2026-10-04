import { View, type StyleProp, type ViewStyle } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { StudentName } from "../../schemas/schedule.schema";
import { colorAt } from "../../utils/colorAt";
import { initials } from "../../utils/initials";

import { AVATAR_SIZES, useStyles, type StudentAvatarSize } from "./StudentAvatar.styles";

type StudentAvatarProps = {
  /** `sm` (36) en los círculos solapados de la próxima clase; `md` (44) en la lista del detalle. */
  size: StudentAvatarSize;
  /** El aro que lo separa del de al lado (`ring-2`). */
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
} & (
  | {
      student: StudentName;
      /** Su posición en la lista (ya ordenada por el contrato): de ella sale su color. */
      index: number;
      /** Viene a recuperar: el aro dorado y la «R» (solo en la tarjeta de la próxima clase). */
      recovery?: boolean;
    }
  | {
      /** Cuántos alumnos más hay: el círculo «+N». */
      more: number;
    }
);

/**
 * El círculo de un alumno con sus iniciales y el degradado de su posición
 * (`colorAt`), o el «+N» de los que no caben. Con `recovery`, el aro dorado y
 * una «R» (la tarjeta de la próxima clase; el detalle marca la recuperación con
 * su etiqueta). Único sitio que lo dibuja: los círculos de la próxima clase y la
 * lista de alumnos del detalle.
 */
export function StudentAvatar(props: StudentAvatarProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { size, ring = false, style } = props;
  const { variant } = AVATAR_SIZES[size];
  const isMore = "more" in props;
  const recovery = !isMore && props.recovery === true;

  return (
    <View style={style}>
      <View
        style={[styles[size], ring && styles.ring, recovery && styles.recoveryRing, isMore && styles.more]}
        testID={isMore ? "student-avatar-more" : "student-avatar"}
      >
        {isMore ? null : (
          <DiagonalGradient colors={colorAt(theme.clubColors, props.index).gradient} style={styles.fill} />
        )}
        <Text variant={variant} color={isMore ? "text" : "onPrimary"}>
          {isMore ? `+${props.more}` : initials(props.student)}
        </Text>
      </View>
      {recovery ? (
        <View style={styles.badge} testID="student-avatar-recovery">
          <Text variant="badge" color="background">
            {t("schedule.next.recoveryBadge")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
