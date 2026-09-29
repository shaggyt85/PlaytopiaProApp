import { z } from "zod";

import { SchoolCardSchema } from "@/shared/schemas/schoolCard.schema";

// Contratos de Core de «Cerca de mí» (`GET /api/MobileTeacher/schools`). La
// tarjeta de sede y «Mis clubes» son compartidos: `shared/schemas/schoolCard`.

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

/** «Cerca de mí»: una página de las sedes a las que puede pedir unirse. */
export const JoinableSchoolsResponseSchema = z.object({
  schools: z.array(SchoolCardSchema),
  pagination: PaginationSchema,
});
export type JoinableSchoolsResponse = z.infer<typeof JoinableSchoolsResponseSchema>;
