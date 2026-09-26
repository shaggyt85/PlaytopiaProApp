import { IconLoBell } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { session } from "@/shared/services/session";
import { formatWeekdayDate } from "@/shared/utils/formatDate";

import { useStyles } from "./HomeScreen.styles";
import { useForegroundNow } from "./hooks/useForegroundNow";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { greetingFor } from "./utils/greeting";

/**
 * Hoy: saludo según la hora, el nombre del profesor y la fecha, con la hora
 * del móvil. Si el perfil no llega, la cabecera sale igual sin el nombre.
 *
 * Provisional: la campana se ve pero aún no hace nada (las notificaciones
 * vendrán después) y el botón de cerrar sesión sigue hasta que exista Perfil.
 */
export function HomeScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const now = useForegroundNow();
  const profile = useTeacherProfile();

  return (
    <TabScreen testID="home-screen">
      <ScreenHeader
        greeting={t(`home.greeting.${greetingFor(new Date(now).getHours())}`)}
        title={profile.data?.name}
        subtitle={formatWeekdayDate(now)}
        right={<IconButton Icon={IconLoBell} accessibilityLabel={t("home.notifications")} />}
      />
      <View style={styles.signOut}>
        <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
      </View>
    </TabScreen>
  );
}
