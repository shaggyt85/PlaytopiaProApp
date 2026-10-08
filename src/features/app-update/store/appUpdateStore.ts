import { create } from "zustand";

/**
 * Si el profesor cerró el aviso de versión nueva («Ahora no» o la X). En
 * memoria: no vuelve a salir hasta que se cierre la app.
 */
interface AppUpdateState {
  softDismissed: boolean;
  dismissSoft: () => void;
}

export const useAppUpdateStore = create<AppUpdateState>((set) => ({
  softDismissed: false,
  dismissSoft: () => set({ softDismissed: true }),
}));
