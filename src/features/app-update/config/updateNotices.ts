import type { TranslationKey } from "@/shared/locales";

import type { UpdateType } from "../schemas/versionCheck.schema";

/**
 * Los dos avisos: sus textos y si se pueden cerrar. Un aviso nuevo es una
 * entrada aquí.
 */
export const UPDATE_NOTICES = {
  force: {
    title: "appUpdate.force.title",
    message: "appUpdate.force.message",
    action: "appUpdate.force.action",
    dismissible: false,
  },
  soft: {
    title: "appUpdate.soft.title",
    message: "appUpdate.soft.message",
    action: "appUpdate.soft.action",
    dismissible: true,
  },
} as const satisfies Record<
  Exclude<UpdateType, "none">,
  { title: TranslationKey; message: TranslationKey; action: TranslationKey; dismissible: boolean }
>;
