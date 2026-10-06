import type { ClubAvailability, ProfileDetails } from "../schemas/profileDetails.schema";

/**
 * Los detalles de Perfil con la semana de una sede cambiada por la que devolvió
 * Core al guardarla; el resto, igual. Sin detalles en la caché, nada que
 * cambiar.
 */
export function withClubWeek(details: ProfileDetails | undefined, saved: ClubAvailability): ProfileDetails | undefined {
  if (!details) return details;
  return {
    ...details,
    availability: details.availability.map((sede) =>
      sede.db_id === saved.db_id && sede.club_id === saved.club_id ? { ...sede, week: saved.week } : sede,
    ),
  };
}
