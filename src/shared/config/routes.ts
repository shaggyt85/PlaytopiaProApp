import type { Href } from "expo-router";

/**
 * Las pantallas a las que se navega desde el código, una vez cada una: si una
 * ruta cambia, se cambia aquí. `Href` no las comprueba (la app no usa las
 * rutas tipadas de expo-router: acepta cualquier texto); lo hace un test
 * (`__tests__/shared/config/routes.test.ts`), que exige a cada una su fichero
 * en `src/app/`, que es lo que crea la ruta. Las que llevan parámetros las
 * arma cada una su `xDetailHref`.
 */
export const ROUTES = {
  // (auth)
  signIn: "/sign-in",
  password: "/password",
  passwordRecovery: "/password-recovery",
  signUp: "/sign-up",
  // (app): las pestañas
  home: "/",
  groups: "/groups",
  profile: "/profile",
  // (app): las pantallas que entran encima
  classDetail: "/class/[dbId]/[classId]",
  groupDetail: "/group/[dbId]/[groupId]",
  studentDetail: "/student/[dbId]/[groupId]/[studentId]",
} as const satisfies Record<string, Href>;
