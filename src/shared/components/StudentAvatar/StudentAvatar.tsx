import { IconLoUser } from "@playtopia/icons/react-native";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { StudentName } from "@/shared/schemas/schedule.schema";
import { colorAt } from "@/shared/utils/colorAt";
import { initials } from "@/shared/utils/initials";

import { AVATAR_SIZES, EMPTY_ICON_SIZE, useStyles, type StudentAvatarSize } from "./StudentAvatar.styles";

type StudentAvatarProps = {
  /** `sm` (36) en los círculos solapados; `md` (44) en la lista del detalle. */
  size: StudentAvatarSize;
  /** El aro que lo separa del de al lado (`ring-2`). */
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
} & (
  | {
      student: StudentName;
      /** Su posición en la lista (ya ordenada por el contrato): de ella sale su color. */
      index: number;
      /** Viene a recuperar: el aro dorado y la «R» (en los círculos solapados). */
      recovery?: boolean;
    }
  | {
      /** Cuántos alumnos más hay: el círculo «+N». */
      more: number;
    }
  | {
      /** Una plaza libre: el círculo de borde discontinuo con una persona. */
      empty: true;
    }
);

/**
 * El círculo de un alumno con sus iniciales y el degradado de su posición
 * (`colorAt`), el «+N» de los que no caben o una plaza libre. Con `recovery`,
 * el aro dorado y una «R» (el detalle marca la recuperación con su etiqueta).
 * Único sitio que lo dibuja: los círculos de la próxima clase, de la última
 * clase del grupo y de «Mis grupos», y la lista de alumnos del detalle.
 */
export function StudentAvatar(props: StudentAvatarProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { size, ring = false, style } = props;
  const { variant } = AVATAR_SIZES[size];

  if ("empty" in props) {
    return (
      <View style={style}>
        <View style={[styles[size], styles.empty]} testID="student-avatar-empty">
          <IconLoUser size={EMPTY_ICON_SIZE} color={theme.colors.textSecondary} />
        </View>
      </View>
    );
  }

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
