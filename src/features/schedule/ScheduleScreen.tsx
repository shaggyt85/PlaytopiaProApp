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
import { DaySchedule } from "./components";
import { useForegroundNow } from "./hooks/useForegroundNow";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { useTodayHeader } from "./hooks/useTodayHeader";

// Hoy solo usa el nombre: no se vuelve a pintar si cambia otro campo del perfil.
const selectName = (profile: TeacherProfile) => profile.name;

/**
 * Agenda (Hoy): saludo según la hora, el nombre del profesor y la fecha, con la
 * hora del móvil, y debajo la vista Día. Si el perfil no llega, la cabecera sale
 * igual sin el nombre.
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
  const name = useTeacherProfile({ select: selectName });

  return (
    <TabScreen testID="schedule-screen">
      <TabScrollView>
        <ScreenHeader
          greeting={t(header.greeting)}
          title={name.data}
          loading={name.isPending}
          subtitle={header.date}
          right={<IconButton Icon={IconLoBell} accessibilityLabel={t("schedule.notifications")} />}
        />
        <DaySchedule now={now} />
        <View style={styles.signOut}>
          <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
        </View>
      </TabScrollView>
    </TabScreen>
  );
}
