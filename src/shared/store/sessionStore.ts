import { create } from "zustand";

/**
 * Estado de la sesión para la navegación. No guarda tokens (van en
 * SecureStore): solo si hay sesión y quién es, sacado de los claims.
 */
export type SessionStatus = "checking" | "authenticated" | "anonymous";

/**
 * Por qué se cerró la sesión la última vez en esta ejecución de la app:
 * - `manual`: lo decidió el profesor (cerrar sesión, no aceptar los términos).
 * - `expired`: Core la dio por muerta o el token no era de profesor.
 * `null` si no se ha cerrado desde que se abrió la app. Vive en memoria: al
 * volver a abrir la app se olvida (tras un cierre manual, la biometría no se
 * lanza sola hasta entonces).
 */
export type SessionEndReason = "manual" | "expired" | null;

export interface SessionUser {
  userId: number;
  /** La escuela (tenant). La sucursal activa es otra cosa y va aparte. */
  dbId: number;
}

interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
  endReason: SessionEndReason;
  setAuthenticated: (user: SessionUser) => void;
  setAnonymous: (endReason?: SessionEndReason) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "checking",
  user: null,
  endReason: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setAnonymous: (endReason = null) => set({ status: "anonymous", user: null, endReason }),
}));
