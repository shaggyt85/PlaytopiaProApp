/**
 * Hora del servidor, no la del móvil.
 *
 * Toda respuesta HTTP trae la cabecera `Date`: aquí se guarda el desfase entre
 * esa hora y la del móvil. Sirve para firmar el `registration_token` del
 * registro (Core lo rechaza si se desvía más de TOKEN_SKEW_SECONDS) y para
 * saber si una clase ya empezó, aunque el móvil tenga la hora puesta a mano.
 *
 * Vive en memoria a propósito: el desfase es de esta sesión; uno guardado de
 * hace días podría ser peor que ninguno.
 */

let offsetMs = 0;
let calibrated = false;

/**
 * Aprende la hora de la cabecera `Date` de una respuesta (buena o de error:
 * la que rechaza un token por desfase también trae la hora buena).
 * Ignora cabeceras ausentes o ilegibles: nunca rompe una petición.
 */
export function recordServerDate(dateHeader: unknown): void {
  if (typeof dateHeader !== "string" || dateHeader.length === 0) return;
  const serverMs = Date.parse(dateHeader);
  if (Number.isNaN(serverMs)) return;
  offsetMs = serverMs - Date.now();
  calibrated = true;
}

/** Milisegundos UNIX según el servidor. Sin calibrar, la hora del móvil. */
export const serverNow = (): number => Date.now() + offsetMs;

/** Segundos UNIX según el servidor (para firmas). */
export const serverNowSeconds = (): number => Math.floor(serverNow() / 1000);

export const isServerClockCalibrated = (): boolean => calibrated;

/** Solo para tests: vuelve al estado inicial. */
export function resetServerClock(): void {
  offsetMs = 0;
  calibrated = false;
}
