import { IconLoClock, IconLoMapPin } from "@playtopia/icons/react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Chevron } from "@/shared/components/Chevron";
import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { StudentAvatars } from "@/shared/components/StudentAvatars";
import { Text } from "@/shared/components/Text";
import { LEVEL_ICON } from "@/shared/config/icons";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { classTimeRange } from "@/shared/utils/classTimeRange";
import { joinParts } from "@/shared/utils/joinParts";
import { studentsLabel } from "@/shared/utils/seatsLabel";
import { splitRecoveries } from "@/shared/utils/splitRecoveries";

import { classA11yLabel } from "../../utils/classA11yLabel";
import { heroLabel, type HeroClass } from "../../utils/heroClass";

import { LIVE_PULSE } from "./NextClassCard.animation";
import { NEXT_CLASS_STOPS, useStyles } from "./NextClassCard.styles";

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
 */
export function NextClassCard({ hero, club, today, now }: NextClassCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const openClass = useOpenClass();
  const { item } = hero;

  const label = heroLabel(hero, today, now, t);
  const seats = studentsLabel(item, t);
  const recoveries = splitRecoveries(item.students).recoveries.length;
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
            <IconText
              Icon={IconLoMapPin}
              label={joinParts([club.label, item.track_name])}
              size="card"
              iconColor="primary"
              numberOfLines={1}
              style={styles.placeRow}
            />
          </View>
          <View style={styles.chevron}>
            <Chevron size="md" alpha={0.7} />
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
          <IconText Icon={IconLoClock} label={classTimeRange(item, t)} size="card" iconColor="primary" />
          {item.level_range ? (
            <IconText Icon={LEVEL_ICON} label={item.level_range} size="card" iconColor="primary" />
          ) : null}
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
