import { IconLoBell, IconLoCalendar, IconLoClock, IconLoUsers } from "@playtopia/icons/react-native";
import { useMemo } from "react";
import { View } from "react-native";

import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { TabScrollView } from "@/shared/components/TabScrollView";
import type { IconComponent } from "@/shared/config/icons";
import type { Theme } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { session } from "@/shared/services/session";

import { useStyles } from "./ScheduleScreen.styles";
import { NextClassCard, ScheduleAgenda, StatTile, TeacherAvatar } from "./components";
import { useForegroundNow } from "./hooks/useForegroundNow";
import { useNextClass } from "./hooks/useNextClass";
import { useScheduleClubs } from "./hooks/useScheduleClubs";
import { useScheduleMonth } from "./hooks/useScheduleMonth";
import { ScheduleScrollProvider, useScheduleScrollRefs } from "./hooks/useScheduleScroll";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { useTodayHeader } from "./hooks/useTodayHeader";
import { heroClass } from "./utils/heroClass";
import { localToday, wallNow } from "./utils/scheduleDates";
import { courtTimeLabel, todayStats, type TodayStats } from "./utils/todayStats";

// La cabecera solo usa el nombre y la foto: no se vuelve a pintar si cambia otro campo del perfil.
const selectHeader = ({ name, avatar }: TeacherProfile) => ({ name, avatar });

interface TodayStat {
  Icon: IconComponent;
  label: TranslationKey;
  /** `text-magenta`, `text-sky`, `text-gold`. */
  color: (theme: Theme) => string;
  value: (stats: TodayStats, t: ReturnType<typeof useTranslation>["t"]) => string;
}

/** Las cifras del día, en el orden del prototipo: clases, alumnos y tiempo en pista. */
const TODAY_STATS: readonly TodayStat[] = [
  { Icon: IconLoCalendar, label: "schedule.today.classes", color: (theme) => theme.colors.primary, value: (s) => String(s.classes) },
  { Icon: IconLoUsers, label: "schedule.today.students", color: (theme) => theme.accents.sky.color, value: (s) => String(s.students) },
  {
    Icon: IconLoClock,
    label: "schedule.today.court",
    color: (theme) => theme.accents.gold.color,
    value: (s, t) => courtTimeLabel(s.minutesOnCourt, t),
  },
];

/**
 * Agenda (Hoy): la foto del profesor (lleva a Perfil), el saludo según la hora,
 * su nombre y la fecha, con la hora del móvil; debajo, las cifras del día, la
 * clase en curso o la próxima (si hay) y la agenda, con sus vistas Día, Semana y Mes. Si el
 * perfil no llega, la cabecera sale igual sin el nombre.
 *
 * Provisional: la campana se ve pero aún no hace nada (las notificaciones
 * vendrán después) y el botón de cerrar sesión sigue hasta que exista Perfil.
 */
export function ScheduleScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  // Un solo reloj para la cabecera y la agenda: nunca dicen días distintos.
  const now = useForegroundNow({ everyMinute: true });
  const header = useTodayHeader(now);
  const today = localToday(now);
  const nextClass = useNextClass(today, now);
  const { clubOf } = useScheduleClubs();
  const profile = useTeacherProfile({ select: selectHeader });
  // Las clases de hoy, de la misma respuesta del mes que la agenda: no pide nada más.
  const { dayClasses, hasData } = useScheduleMonth(today);
  const stats = useMemo(() => todayStats(dayClasses), [dayClasses]);
  // La tarjeta de arriba: la clase en curso o, si no hay, la próxima de Core.
  // La lista del Mes lleva a la vista el día tocado: desplaza esta pantalla.
  const scrollRefs = useScheduleScrollRefs();
  const hero = useMemo(() => heroClass(dayClasses, nextClass, wallNow(now)), [dayClasses, nextClass, now]);

  return (
    <TabScreen testID="schedule-screen">
      <TabScrollView scrollRef={scrollRefs.scrollRef} innerViewRef={scrollRefs.innerViewRef}>
        <ScreenHeader
          left={<TeacherAvatar url={profile.data?.avatar} />}
          greeting={t(header.greeting)}
          title={profile.data?.name}
          loading={profile.isPending}
          subtitle={header.date}
          right={<IconButton Icon={IconLoBell} accessibilityLabel={t("schedule.notifications")} />}
        />
        {/* Sin la agenda aún, nada: un «0» que luego cambia diría algo falso. */}
        {hasData ? (
          <View style={styles.stats} testID="today-stats">
            {TODAY_STATS.map(({ Icon, label, color, value }) => (
              <StatTile key={label} Icon={Icon} color={color(theme)} value={value(stats, t)} label={t(label)} />
            ))}
          </View>
        ) : null}
        {hero ? (
          <View style={styles.nextClass}>
            <NextClassCard hero={hero} club={clubOf(hero.item)} today={today} now={now} />
          </View>
        ) : null}
        <ScheduleScrollProvider {...scrollRefs}>
          <ScheduleAgenda now={now} today={today} nextClassId={nextClass?.id} clubOf={clubOf} />
        </ScheduleScrollProvider>
        <View style={styles.signOut}>
          <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
        </View>
      </TabScrollView>
    </TabScreen>
  );
}
