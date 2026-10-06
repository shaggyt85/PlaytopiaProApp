import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { session } from "@/shared/services/session";

import { accountDeletionService, type IAccountDeletionService } from "../services/accountDeletionService";
import { useProfileEditorStore } from "../store/profileEditorStore";

/**
 * Da de baja la cuenta. Si sale bien, Core ya ha revocado la sesión: se cierra
 * el panel (si no, se volvería a abrir en el siguiente acceso), se termina la
 * sesión como baja (`deleted`: borra también la biometría y la caché, así que
 * no hay nada que invalidar) y un `Alert` nativo, que sobrevive al cambio de
 * pantalla, dice cuándo se borrarán sus datos.
 */
export function useDeleteAccount(service: IAccountDeletionService = accountDeletionService) {
  const { t } = useTranslation();
  const closeEditor = useProfileEditorStore((state) => state.close);
  return useMutation({
    mutationFn: (reason: string) => service.request(reason),
    onSuccess: async ({ anonymize_after_days }) => {
      closeEditor();
      await session.end("deleted");
      Alert.alert(
        t("profile.deleteAccount.done"),
        t("profile.deleteAccount.doneMessage", { count: anonymize_after_days }),
      );
    },
  });
}
