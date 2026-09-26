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

import { useStyles } from "./HomeScreen.styles";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { useTodayHeader } from "./hooks/useTodayHeader";

// Hoy solo usa el nombre: no se vuelve a pintar si cambia otro campo del perfil.
const selectName = (profile: TeacherProfile) => profile.name;

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
  const header = useTodayHeader();
  const name = useTeacherProfile({ select: selectName });

  return (
    <TabScreen testID="home-screen">
      <TabScrollView>
        <ScreenHeader
          greeting={t(header.greeting)}
          title={name.data}
          loading={name.isPending}
          subtitle={header.date}
          right={<IconButton Icon={IconLoBell} accessibilityLabel={t("home.notifications")} />}
        />
        <View style={styles.signOut}>
          <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
        </View>
      </TabScrollView>
    </TabScreen>
  );
}
