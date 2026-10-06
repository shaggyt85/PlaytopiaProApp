import { create } from "zustand";

/** Las partes de Perfil que se editan en su panel. Cada fase añade la suya. */
export type ProfileSection = "personal" | "professional";

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
