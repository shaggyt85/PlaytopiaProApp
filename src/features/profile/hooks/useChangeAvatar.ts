import { Linking } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import { alertError } from "@/shared/utils/alertError";

import { photoPicker, type IPhotoPicker, type PhotoSource } from "../services/photoPicker";
import { chooseAction } from "../utils/chooseAction";

import { useUploadAvatar } from "./useUploadAvatar";

/** Los orígenes que se ofrecen, en este orden. Uno nuevo es una línea (y su entrada en el selector). */
const AVATAR_SOURCES = [
  { key: "camera", label: "profile.avatar.takePhoto" },
  { key: "library", label: "profile.avatar.chooseFromLibrary" },
] as const satisfies readonly { key: PhotoSource; label: TranslationKey }[];

/**
 * Cambiar la foto de perfil: elegir de dónde sale (`chooseAction`), elegirla y
 * subirla (`useUploadAvatar`). Sin permiso de la cámara, ofrece abrir los
 * ajustes. Un fallo, en un `Alert` traducido (`alertError`). Sin aviso al
 * terminar: la foto nueva ya lo dice.
 */
export function useChangeAvatar(picker: IPhotoPicker = photoPicker) {
  const { t } = useTranslation();
  const upload = useUploadAvatar();

  const offerSettings = () =>
    chooseAction(
      {
        title: t("profile.avatar.cameraDenied"),
        message: t("profile.avatar.cameraDeniedMessage"),
        actions: [{ text: t("profile.avatar.openSettings"), onPress: () => void Linking.openSettings() }],
      },
      t,
    );

  const pickFrom = async (source: PhotoSource) => {
    try {
      const result = await picker.pick(source);
      if (result.status === "denied") offerSettings();
      if (result.status === "picked") upload.mutate(result.photo, { onError: alertError });
    } catch (error) {
      alertError(error);
    }
  };

  const change = () =>
    chooseAction(
      {
        title: t("profile.avatar.change"),
        actions: AVATAR_SOURCES.map(({ key, label }) => ({ text: t(label), onPress: () => void pickFrom(key) })),
      },
      t,
    );

  return { change, uploading: upload.isPending };
}
