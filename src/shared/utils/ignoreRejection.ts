/**
 * Espera una promesa sin que su rechazo salga: da su valor o `undefined`. Para
 * las mutaciones de un formulario, cuyo error ya queda en la mutación (y se
 * pinta), así que aquí no hay nada más que hacer con él.
 */
export const ignoreRejection = <T>(promise: Promise<T>): Promise<T | undefined> => promise.catch(() => undefined);
