import { IconLoTrash2 } from "@playtopia/icons/react-native";

import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useProfileEditorStore } from "../../store/profileEditorStore";

/**
 * «Borrar cuenta», bajo «Cerrar sesión», con el borde rojo del prototipo. Abre
 * la baja en el panel de Perfil: Core pide el motivo.
 */
export function DeleteAccountButton() {
  const { t } = useTranslation();
  const open = useProfileEditorStore((state) => state.open);
  return (
    <Button
      title={t("profile.deleteAccount.title")}
      variant="dangerOutline"
      Icon={IconLoTrash2}
      onPress={() => open("deleteAccount")}
    />
  );
}
