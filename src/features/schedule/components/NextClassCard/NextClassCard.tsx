import {
  IconLoActivity,
  IconLoChevronRight,
  IconLoClock,
  IconLoMapPin,
} from "@playtopia/icons/react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { withAlpha } from "@/shared/utils/color";
import { joinParts } from "@/shared/utils/joinParts";

import { useOpenClass } from "../../hooks/useOpenClass";
import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { classA11yLabel } from "../../utils/classA11yLabel";
import { classTimeRange } from "../../utils/classTimeRange";
import { heroLabel, type HeroClass } from "../../utils/heroClass";
import { PressableScale } from "../PressableScale";
import { StudentAvatars } from "../StudentAvatars";

import { LIVE_PULSE } from "./NextClassCard.animation";
import { CHEVRON_SIZE, NEXT_CLASS_STOPS, SMALL_ICON, useStyles } from "./NextClassCard.styles";

interface NextClassCardProps {
  /** La clase en curso o la próxima (`heroClass`). */
  hero: HeroClass;
  club: ScheduleClub;
  /** Hoy, `YYYY-MM-DD`, y el reloj de la pantalla: para decir cuándo empieza. */
  today: string;
  now: number;
}

/**
 * La tarjeta de arriba de la agenda, como el prototipo: la clase en curso
 * («● EN CURSO», con el punto latiendo) o la próxima («● PRÓXIMA CLASE · EN 45
 * MIN»); el título, el club y la pista; los alumnos (con la «R» de quien
 * recupera), «4/4 ALUMNOS» y cuántos recuperan; y debajo de una línea, la franja
 * horaria y el nivel tal como lo manda Core. Al tocarla se abre su detalle.
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export function NextClassCard({ hero, club, today, now }: NextClassCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const { item } = hero;

  const label = heroLabel(hero, today, now, t);
  const seats = t("schedule.next.students", { taken: item.current_participants, max: item.max_participants });
  const recoveries = item.students.filter((s) => s.is_recovery).length;
  const recoveriesLabel = recoveries > 0 ? t("schedule.next.recoveries", { count: recoveries }) : null;
  const a11y = joinParts(
    [
      label,
      classA11yLabel(item, club.label, "upcoming", t),
      t("schedule.next.level", { range: item.level_range }),
      recoveriesLabel,
    ],
    ", ",
  );

  return (
    <PressableScale
      onPress={() => openClass(item)}
      accessibilityLabel={a11y}
      accessibilityHint={t("schedule.detail.openHint")}
      testID="next-class"
    >
      <View style={styles.card}>
        <DiagonalGradient colors={theme.gradients.nextClass} locations={NEXT_CLASS_STOPS} style={styles.fill} />

        <View style={styles.top}>
          <View style={styles.texts}>
            <View style={styles.labelRow}>
              <LiveDot live={hero.live} />
              <Text variant="chip" color="primary" numberOfLines={1} style={styles.label}>
                {label}
              </Text>
            </View>
            <Text variant="subtitle" numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            <View style={styles.placeRow}>
              <IconLoMapPin size={SMALL_ICON} color={theme.colors.primary} />
              <Text variant="caption" color="textSecondary" numberOfLines={1} style={styles.place}>
                {joinParts([club.label, item.track_name])}
              </Text>
            </View>
          </View>
          <View style={styles.chevron}>
            <IconLoChevronRight size={CHEVRON_SIZE} color={withAlpha(theme.colors.textSecondary, 0.7)} />
          </View>
        </View>

        <View style={styles.studentsRow}>
          <StudentAvatars students={item.students} />
          <View style={styles.seats}>
            <Text variant="segment">{seats}</Text>
            {recoveriesLabel ? (
              <Text variant="metaStrong" style={{ color: theme.accents.gold.color }}>
                {recoveriesLabel}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <IconLoClock size={SMALL_ICON} color={theme.colors.primary} />
            <Text variant="caption" color="textSecondary">
              {classTimeRange(item, t)}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <IconLoActivity size={SMALL_ICON} color={theme.colors.primary} />
            <Text variant="caption" color="textSecondary">
              {item.level_range}
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

/** El punto de la etiqueta: late mientras la clase está en curso (salvo con «reducir movimiento»). */
function LiveDot({ live }: { live: boolean }) {
  const styles = useStyles();
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (live && !reduceMotion) {
      opacity.set(withRepeat(withTiming(LIVE_PULSE.minOpacity, { duration: LIVE_PULSE.halfMs }), -1, true));
    } else {
      cancelAnimation(opacity);
      opacity.set(1);
    }
  }, [live, reduceMotion, opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return <Animated.View style={[styles.labelDot, pulse]} testID="next-class-dot" />;
}
