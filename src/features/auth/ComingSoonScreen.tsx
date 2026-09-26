import { useRouter } from "expo-router";

import { EmptyState } from "@/shared/components/EmptyState";
import { Screen } from "@/shared/components/Screen";
import { useTranslation } from "@/shared/hooks/useTranslation";

// Provisional para las pantallas del flujo que aún no existen (registro,
// recuperar contraseña). Se borra, junto con `auth.comingSoon`, al crearlas.
export function ComingSoonScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        title={t("auth.comingSoon")}
        actionLabel={t("common.back")}
        onAction={() => router.back()}
      />
    </Screen>
  );
}
