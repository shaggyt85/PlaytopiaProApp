import { create } from "zustand";

/** Lo que se abre en el panel de Perfil: los editores y la baja de la cuenta. */
export type ProfileSection = "personal" | "professional" | "availability" | "deleteAccount";

/** Lo que se abre con el «Editar» de una tarjeta: todo menos la baja, que tiene su botón. */
export type EditableSection = Exclude<ProfileSection, "deleteAccount">;

/**
 * Qué editor de Perfil está abierto. Estado de la interfaz, en memoria: el
 * panel (`ProfileEditorSheet`) se monta una vez fuera de las pantallas y las
 * tarjetas solo lo abren con su sección.
 */
interface ProfileEditorState {
  section: ProfileSection | null;
  open: (section: ProfileSection) => void;
  close: () => void;
}

export const useProfileEditorStore = create<ProfileEditorState>((set) => ({
  section: null,
  open: (section) => set({ section }),
  close: () => set({ section: null }),
}));
