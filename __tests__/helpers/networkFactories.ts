import type { JoinableSchoolsResponse, SchoolCard } from "@/features/network/schemas/network.schema";

/** Una sede de ejemplo; el nombre de la escuela sale de su `db_id`. */
export const schoolCard = (db_id = 4, club_id = 7, overrides: Partial<SchoolCard> = {}): SchoolCard => ({
  db_id,
  club_id,
  name: `Escuela ${db_id}`,
  club_name: null,
  city: "Sevilla",
  address: "Calle Mayor 3",
  background_url: "https://core-dev.playtopiax.com/api/img/x.jpg",
  ...overrides,
});

/** Una página de «Cerca de mí» como la manda Core. */
export const joinablePage = (
  page: number,
  totalPages: number,
  schools: SchoolCard[],
  totalCount = 25,
): JoinableSchoolsResponse => ({
  schools,
  pagination: { page, size: 10, total_count: totalCount, total_pages: totalPages },
});
