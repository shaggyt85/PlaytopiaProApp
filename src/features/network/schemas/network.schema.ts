import { z } from "zod";

// Contratos de Core (Scalar, grupo Mobile Teacher). La misma tarjeta sirve a
// «Mis clubes» (`GET /api/MobileTeacher/clubs`) y a «Cerca de mí»
// (`GET /api/MobileTeacher/schools`): se define una sola vez.

/** Una sede, lo que pinta su tarjeta (`SchoolCardDto`). */
export const SchoolCardSchema = z.object({
  /** Escuela. La identidad de una sede es `db_id` + `club_id`. */
  db_id: z.number().int(),
  /** Sede dentro de la escuela. */
  club_id: z.number().int(),
  /** Nombre de la escuela. */
  name: z.string(),
  /** Nombre de la sede; `null` si la escuela no le puso uno propio. */
  club_name: z.string().nullable(),
  city: z.string(),
  address: z.string(),
  /**
   * Portada por el proxy de imágenes. Siempre llega: sin una propia, Core manda
   * la del bucket. Es `z.string()` y no `z.url()` a propósito: una URL rara no
   * debe tumbar la lista entera; si la imagen no carga, la tarjeta pinta el
   * fondo del tema.
   */
  background_url: z.string(),
});
export type SchoolCard = z.infer<typeof SchoolCardSchema>;

/**
 * Paginación de Core (`PaginationResponse`), la de todos los listados. Vive en
 * la feature hasta que la use una segunda: entonces pasa a `shared/schemas/`.
 */
export const PaginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  total_count: z.number().int(),
  total_pages: z.number().int(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

/** «Mis clubes»: las sedes donde trabaja. Todas de una vez, sin paginar. */
export const MyClubsResponseSchema = z.object({
  clubs: z.array(SchoolCardSchema),
});
export type MyClubsResponse = z.infer<typeof MyClubsResponseSchema>;

/** «Cerca de mí»: una página de las sedes a las que puede pedir unirse. */
export const JoinableSchoolsResponseSchema = z.object({
  schools: z.array(SchoolCardSchema),
  pagination: PaginationSchema,
});
export type JoinableSchoolsResponse = z.infer<typeof JoinableSchoolsResponseSchema>;
