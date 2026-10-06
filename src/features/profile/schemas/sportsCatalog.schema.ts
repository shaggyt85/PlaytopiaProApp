import { z } from "zod";

import { TeacherSportSchema } from "@/shared/schemas/teacherProfile.schema";

/**
 * Los deportes que puede elegir el profesor (`GET /api/MobileTeacher/sports`,
 * `OfferedSportsResponse`): cada uno con sus especialidades, en el orden del
 * catálogo y con los nombres traducidos. Es la misma forma que los deportes de
 * su perfil (`TeacherSportSchema`): no se repite.
 */
export const SportsCatalogResponseSchema = z.object({
  sports: z.array(TeacherSportSchema),
});
