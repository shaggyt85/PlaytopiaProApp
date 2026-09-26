import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { StateLayout } from "@/shared/components/StateLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { session } from "@/shared/services/session";

// Provisional: el contenido del inicio se define con las pantallas del
// profesor. El botón de cerrar sesión es temporal para poder probar el login;
// se quita cuando existan el menú y ajustes (como en la app de alumnos).
export function HomeScreen() {
  const { t } = useTranslation();
  return (
    <Screen testID="home-screen">
      <StateLayout>
        <Button title={t("common.signOut")} variant="secondary" onPress={() => session.end()} />
      </StateLayout>
    </Screen>
  );
}
