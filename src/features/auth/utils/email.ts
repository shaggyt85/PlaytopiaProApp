/** Normaliza un email para compararlo: sin espacios alrededor y en minúsculas. */
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/** ¿Son el mismo email, escritos como sea? */
export const sameEmail = (a: string | null | undefined, b: string | null | undefined): boolean =>
  !!a && !!b && normalizeEmail(a) === normalizeEmail(b);
