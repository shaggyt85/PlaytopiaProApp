import { create } from "zustand";

/**
 * Estado de la sesión para la navegación. No guarda tokens (van en
 * SecureStore): solo si hay sesión y quién es, sacado de los claims.
 */
export type SessionStatus = "checking" | "authenticated" | "anonymous";

export interface SessionUser {
  userId: number;
  /** La escuela (tenant). La sucursal activa es otra cosa y va aparte. */
  dbId: number;
}

interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
  setAuthenticated: (user: SessionUser) => void;
  setAnonymous: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "checking",
  user: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setAnonymous: () => set({ status: "anonymous", user: null }),
}));
