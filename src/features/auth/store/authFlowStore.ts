import { create } from "zustand";

/**
 * Lo que la pantalla del email le pasa a la de contraseña. Solo estado de UI
 * del flujo: nunca la contraseña ni tokens.
 */
interface AuthFlowState {
  email: string;
  /** El email también es de alumno: la contraseña puede ser la de la otra cuenta. */
  isStudent: boolean;
  setCheckedEmail: (email: string, isStudent: boolean) => void;
  reset: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  email: "",
  isStudent: false,
  setCheckedEmail: (email, isStudent) => set({ email, isStudent }),
  reset: () => set({ email: "", isStudent: false }),
}));
