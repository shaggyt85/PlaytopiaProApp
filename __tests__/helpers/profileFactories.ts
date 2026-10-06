import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import type { ProfileDetails } from "@/features/profile/schemas/profileDetails.schema";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

/**
 * El perfil del profesor 42 tal como lo deja la app tras validarlo: una sola
 * definición para los tests del acceso, del inicio y de Perfil. Un campo nuevo
 * del contrato se añade aquí y nada más.
 */
export const teacherProfile = (overrides: Partial<TeacherProfile> = {}): TeacherProfile => ({
  id: 42,
  name: "David",
  last_name: "Álvarez",
  email: "david@playtopia.com",
  phone_number: "+34600123456",
  birthday: "1990-05-15T00:00:00",
  gender: 1,
  avatar: "https://img.test/avatars/teacher/42.jpg",
  terms_version: TERMS_VERSION,
  accepted_terms_at: "2026-09-26T10:00:00",
  description: "Entrenador de pádel especializado en cantera y competición.",
  experience_years: 6,
  sports: [
    {
      code: "padel",
      name: "Pádel",
      specialties: [
        { code: "technique", name: "Técnica" },
        { code: "tactics", name: "Táctica" },
      ],
    },
  ],
  ...overrides,
});

/**
 * Lo que responde Core al perfil: lo que valida la app más lo que manda y la
 * app no usa (Zod lo descarta).
 */
export const teacherProfileResponse = (overrides: Partial<TeacherProfile> = {}) => ({
  ...teacherProfile(overrides),
  address: null,
  score: 0,
  date: "2026-01-10T09:00:00",
  last_login: null,
  document_id: "",
});

/** Una sede del profesor: la 70 de la escuela 7. */
export const profileClub = { db_id: 7, club_id: 70, school_name: "Escuela Siete", club_name: "Club Padel Indoor Madrid" };

/** Una cifra de horas: 9 h hechas de 12 planificadas en 8 clases de 11. */
export const hoursTally = {
  planned_minutes: 720,
  done_minutes: 540,
  planned_classes: 11,
  done_classes: 8,
};

/** El perfil con sus horas (octubre y septiembre) y su semana en la sede 70. */
export const profileDetails = (overrides: Partial<ProfileDetails> = {}): ProfileDetails => ({
  ...teacherProfile(),
  hours: {
    clubs: [profileClub],
    months: [
      { month: "2026-10", total: hoursTally, clubs: [{ db_id: 7, club_id: 70, ...hoursTally }] },
      {
        month: "2026-09",
        total: { planned_minutes: 0, done_minutes: 0, planned_classes: 0, done_classes: 0 },
        clubs: [{ db_id: 7, club_id: 70, planned_minutes: 0, done_minutes: 0, planned_classes: 0, done_classes: 0 }],
      },
    ],
  },
  availability: [{ ...profileClub, week: { "1": [16, 17, 18], "3": [9, 10] } }],
  ...overrides,
});
