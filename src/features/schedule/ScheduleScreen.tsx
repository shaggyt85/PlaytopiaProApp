import { IconLoBell } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { TabScrollView } from "@/shared/components/TabScrollView";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { session } from "@/shared/services/session";

import { useStyles } from "./ScheduleScreen.styles";
import { NextClassCard, ScheduleAgenda, TeacherAvatar } from "./components";
import { useForegroundNow } from "./hooks/useForegroundNow";
import { useNextClass } from "./hooks/useNextClass";
import { useScheduleClubs } from "./hooks/useScheduleClubs";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { useTodayHeader } from "./hooks/useTodayHeader";
import { localToday } from "./utils/scheduleDates";

// La cabecera solo usa el nombre y la foto: no se vuelve a pintar si cambia otro campo del perfil.
const selectHeader = ({ name, avatar }: TeacherProfile) => ({ name, avatar });

/**
 * Agenda (Hoy): la foto del profesor (lleva a Perfil), el saludo según la hora,
 * su nombre y la fecha, con la hora del móvil; debajo, la próxima clase (si hay) y la agenda, con sus vistas
 * Día, Semana y Mes. Si el perfil no llega, la cabecera sale igual sin el nombre.
 *
 * Provisional: la campana se ve pero aún no hace nada (las notificaciones
 * vendrán después) y el botón de cerrar sesión sigue hasta que exista Perfil.
 */
export function ScheduleScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  // Un solo reloj para la cabecera y la agenda: nunca dicen días distintos.
  const now = useForegroundNow({ everyMinute: true });
  const header = useTodayHeader(now);
  const today = localToday(now);
  const nextClass = useNextClass(today, now);
  const { clubs, clubOf } = useScheduleClubs();
  const profile = useTeacherProfile({ select: selectHeader });

  return (
    <TabScreen testID="schedule-screen">
      <TabScrollView>
        <ScreenHeader
          left={<TeacherAvatar url={profile.data?.avatar} />}
          greeting={t(header.greeting)}
          title={profile.data?.name}
          loading={profile.isPending}
          subtitle={header.date}
          right={<IconButton Icon={IconLoBell} accessibilityLabel={t("schedule.notifications")} />}
        />
        {nextClass ? (
          <View style={styles.nextClass}>
            <NextClassCard item={nextClass} club={clubOf(nextClass)} today={today} />
          </View>
        ) : null}
        <ScheduleAgenda now={now} today={today} nextClassId={nextClass?.id} clubs={clubs} clubOf={clubOf} />
        <View style={styles.signOut}>
          <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
        </View>
      </TabScrollView>
    </TabScreen>
  );
}
