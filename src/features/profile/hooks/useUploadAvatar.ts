import { useMutation } from "@tanstack/react-query";

import { avatarService, type IAvatarService } from "../services/avatarService";
import type { PickedPhoto } from "../services/photoPicker";
import { prepareAvatar } from "../utils/prepareAvatar";

import { useStoreProfile } from "./useStoreProfile";

/**
 * Sube la foto elegida: la reduce (`prepareAvatar`) y la sube, todo dentro de
 * la mutación para que «subiendo» cubra los dos pasos. La URL nueva se deja en
 * el perfil de la caché (`useStoreProfile`): la Agenda y Perfil la enseñan al
 * instante.
 */
export function useUploadAvatar(service: IAvatarService = avatarService, prepare = prepareAvatar) {
  const storeProfile = useStoreProfile();
  return useMutation({
    mutationFn: async (photo: PickedPhoto) => service.upload(await prepare(photo)),
    onSuccess: (url) => storeProfile((profile) => ({ ...profile, avatar: url })),
  });
}
