import { create } from "zustand";

/** Cuánto dura la oferta de activar la biometría tras entrar con contraseña. */
export const BIOMETRIC_OFFER_TTL_MS = 60_000;

export interface BiometricOffer {
  email: string;
  userId: number;
  createdAt: number;
}

/**
 * Oferta de activar la biometría justo después de entrar con contraseña. Solo
 * en memoria y sin tokens: el refresh token se lee al activarla (guía §8).
 */
interface BiometricOfferState {
  offer: BiometricOffer | null;
  setOffer: (email: string, userId: number) => void;
  clear: () => void;
}

export const useBiometricOfferStore = create<BiometricOfferState>((set) => ({
  offer: null,
  setOffer: (email, userId) => set({ offer: { email, userId, createdAt: Date.now() } }),
  clear: () => set({ offer: null }),
}));

/** ¿Sigue vigente la oferta? */
export const isOfferValid = (offer: BiometricOffer | null, now = Date.now()): offer is BiometricOffer =>
  offer !== null && now - offer.createdAt < BIOMETRIC_OFFER_TTL_MS;
