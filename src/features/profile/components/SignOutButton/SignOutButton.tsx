import { IconLoLogOut } from "@playtopia/icons/react-native";
import { Alert } from "react-native";

import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { session } from "@/shared/services/session";

/**
 * «Cerrar sesión», con confirmación en un `Alert` nativo, como el prototipo.
 * Cierra con `session.end()`, el único sitio que cierra la sesión: los guards
 * llevan solos al acceso.
 */
export function SignOutButton() {
  const { t } = useTranslation();
  const confirm = () =>
    Alert.alert(t("profile.signOutConfirm"), undefined, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.signOut"), style: "destructive", onPress: () => void session.end() },
    ]);
  return <Button title={t("common.signOut")} variant="danger" Icon={IconLoLogOut} onPress={confirm} />;
}
