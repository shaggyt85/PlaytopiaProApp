import { useSessionStore } from "@/shared/store/sessionStore";

// Lo que comparten los tests de la agenda. Jest obliga a escribir el
// `jest.mock` en cada fichero, pero la fábrica es esta:
//
//   jest.mock("@/shared/services/scheduleService", () =>
//     require("../../../helpers/scheduleMocks").scheduleServiceModule(),
//   );

/** El módulo del servicio de la agenda con sus tres llamadas simuladas. */
export const scheduleServiceModule = () => ({
  ...jest.requireActual("@/shared/services/scheduleService"),
  scheduleService: { getClasses: jest.fn(), markAttendance: jest.fn(), getPreviousClass: jest.fn() },
});

/** El módulo de «Mis clubes» con `getMyClubs` simulado. */
export const myClubsServiceModule = () => ({
  ...jest.requireActual("@/shared/services/myClubsService"),
  myClubsService: { getMyClubs: jest.fn() },
});

/** La sesión abierta del profesor de ejemplo (las claves de la agenda llevan su id). */
export const signInTeacher = () => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
