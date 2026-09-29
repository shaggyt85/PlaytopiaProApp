import { create } from "zustand";

/** Lo que `check-email` dijo del email, con nombre para que no se crucen. */
export interface CheckedEmailFacts {
  /** El email también es de alumno: la contraseña puede ser la de la otra cuenta. */
  isStudent: boolean;
  /** La cuenta de profesor aún no tiene contraseña: la recuperación la crea. */
  needsPasswordSetup: boolean;
}

/**
 * Lo que la pantalla del email le pasa a la siguiente (contraseña, registro o
 * recuperación). Solo estado de UI del flujo: nunca la contraseña ni tokens.
 */
interface AuthFlowState extends CheckedEmailFacts {
  email: string;
  setCheckedEmail: (email: string, facts: CheckedEmailFacts) => void;
  reset: () => void;
}

const EMPTY = { email: "", isStudent: false, needsPasswordSetup: false };

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  ...EMPTY,
  setCheckedEmail: (email, facts) => set({ email, ...facts }),
  reset: () => set(EMPTY),
}));
