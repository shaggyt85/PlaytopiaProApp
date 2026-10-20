import { z } from "zod";

/** Una respuesta sin cuerpo que leer (204, o un cuerpo que la app no usa): se descarta. */
export const NoContentSchema = z.unknown().transform((): void => undefined);
