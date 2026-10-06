import { IconLoLogOut } from "@playtopia/icons/react-native";

import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { session } from "@/shared/services/session";

import { confirmDestructive } from "../../utils/confirmDestructive";

/**
 * «Cerrar sesión», con confirmación en un `Alert` nativo, como el prototipo.
 * Cierra con `session.end()`, el único sitio que cierra la sesión: los guards
 * llevan solos al acceso.
 */
export function SignOutButton() {
  const { t } = useTranslation();
  const confirm = () =>
    confirmDestructive(
      { title: t("profile.signOutConfirm"), confirm: t("common.signOut"), onConfirm: () => void session.end() },
      t,
    );
  return <Button title={t("common.signOut")} variant="danger" Icon={IconLoLogOut} onPress={confirm} />;
}
