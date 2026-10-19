import { z } from "zod";

// La tarjeta de una sede de Core (`SchoolCardDto`, grupo Mobile Teacher). La
// usan «Red de clubes» (Mis clubes y Cerca de mí) y la agenda (el nombre y el
// color de cada club): se define una sola vez.

/** Una sede, lo que pinta su tarjeta. */
export const SchoolCardSchema = z.object({
  /** Escuela. La identidad de una sede es `db_id` + `club_id` (`branchKey`). */
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

/** «Mis clubes» (`GET /api/MobileTeacher/clubs`): todas sus sedes, sin paginar. */
export const MyClubsResponseSchema = z.object({
  clubs: z.array(SchoolCardSchema),
});
export type MyClubsResponse = z.infer<typeof MyClubsResponseSchema>;
