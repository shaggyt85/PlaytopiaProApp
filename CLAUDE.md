# CLAUDE.md — Playtopia Pro (app Profesor, repo PlaytopiaAppPro)

App móvil Expo / React Native para profesores de Playtopia. Hermana de `D:\playtopia\PlaytopiaAppStudent`: ante la duda sobre cómo se resuelve algo de infraestructura, mira cómo lo hace esa app y aplícalo con la estructura de este repo.

**SDK:** este repo usa **Expo SDK 57** (React Native 0.86, React 19.2); la appStudent sigue en el SDK 54. Al traer una pieza de allí, comprueba en `https://docs.expo.dev/versions/v57.0.0/` que las APIs de Expo que usa no han cambiado. Las dependencias nativas se instalan con la versión de la lista oficial del SDK (`expo/bundledNativeModules.json`).

Detalle completo de cada regla: [`docs/GUIA_APP_PROFESOR.md`](./docs/GUIA_APP_PROFESOR.md).

**Idioma:** responde, comenta el código y escribe los commits en español.

## Comandos

```bash
pnpm install            # solo pnpm (pnpm 11, fijado en packageManager)
pnpm start              # desarrollo contra core-dev
pnpm test               # Jest
pnpm lint
pnpm typecheck          # tsc de la app y de __tests__
pnpm verificar:ota      # obligatorio antes de cualquier eas update
```

## Backend

- API: `https://core-dev.playtopiax.com/api` (`EXPO_PUBLIC_API_BASE_URL`).
- **Antes de escribir un schema, mira el endpoint en Scalar: `https://core-dev.playtopiax.com/docs`.** El contrato de Scalar manda: snake_case, tal cual lo devuelve Core.
- Login: `POST /api/auth/login/teacher` (role_id = 4). Registro: `POST /api/UserTeacher` con `registration_token` HMAC. Recuperación: `POST /api/PassRecovery/request` **con `scope: "teacher"`**.
- **Si falta el endpoint o no devuelve lo necesario, no pares la pantalla:** schema con el contrato esperado + `xService.mock.ts` que implementa la misma interfaz y pasa por el mismo `validate*` + interruptor `X_USE_MOCK` por endpoint + comentario `// MOCK: pendiente en Core, ver docs/endpoints-pendientes/<archivo>.md` + petición en `docs/endpoints-pendientes/<feature>-<accion>.md`. Actualiza la tabla "Endpoints en uso" de la guía.

## Estructura

```
src/
  app/                 solo rutas: importan <X>Screen del index.ts de la feature
  features/<pantalla>/ components/ hooks/ services/ schemas/ [store/] <X>Screen.tsx index.ts
  shared/              components/ hooks/ services/ schemas/ store/ locales/ config/ utils/
__tests__/             espejo de src/ (+ helpers/, setup/)
docs/                  GUIA_APP_PROFESOR.md + endpoints-pendientes/
```

1. Una feature = una pantalla, con todo lo suyo dentro.
2. Nada de carpetas por tipo en la raíz de `src/`.
3. `shared/` solo para lo que usan 2+ features, siempre en la carpeta de su tipo; nunca archivos sueltos. Mientras lo use una sola feature, se queda en ella.
4. `shared/` no importa de `features/`; una feature no importa de otra.
5. Alias único `@/` → `src/`. Carpetas kebab-case, componentes PascalCase, hooks `useX`, siempre `index.ts`.
6. Tests en la ruta espejo: `src/features/x/hooks/useY.ts` → `__tests__/features/x/hooks/useY.test.ts`. Si mueves un archivo, mueve su test.

## Principios

- **S:** schema = contrato, service = HTTP + validación, hook = caché/estado, componente = pintar, Screen = componer.
- **O:** extiende sin modificar (herencia de `BaseHttpClient`, mapas de configuración en vez de `switch`).
- **L:** cualquier implementación de `IXService` (real o mock) es intercambiable.
- **I:** interfaces pequeñas, props mínimas.
- **D:** hooks dependen de la interfaz del service; el service depende de `IHttpClient`. Clase + interfaz + singleton.
- **DRY:** una sola definición por cosa (tipos con `z.infer`, query keys en factory, textos en locales). Se mueve a `shared/` a la segunda vez que se necesita, no antes.

## Reglas duras

- **Secretos:** ninguno al repo. Solo se sube `.env.example`. Todo por env, validado en `shared/config/env.ts`; nunca leas `process.env` fuera de ahí. `EXPO_PUBLIC_*` va dentro del bundle: solo valores públicos (la firma HMAC del registro es la excepción documentada). Secretos reales (Sentry auth token, tiendas, EAS) solo en variables de EAS. `google-services.json` como variable de fichero de EAS.
- **Errores RFC 9457:** todo fallo pasa por `HttpError` con su `ProblemDetail` (`shared/schemas/problemDetail.schema.ts`). Se traduce con `getErrorMessage(error)` (`errors.byType.<clave>` → `errors.byStatus.<status>` → genérico), **nunca se muestra el `detail`**. Para ramificar, usa `type` y los extension members, nunca el texto.
- **Caché:** cada query usa una `CachePolicy` de `shared/config/cachePolicies.ts` (`STATIC`, `STANDARD`, `LIVE`, `POLLING(ms, cuándo)`, `ALWAYS_FRESH`). Nada de `staleTime` a mano sin un comentario que explique el porqué. Tras mutar, se invalida.
- **Estado:** servidor solo en TanStack Query; Zustand solo para UI (`features/<x>/store/` o `shared/store/`).
- **Almacenamiento:** SecureStore para lo que permite actuar como el usuario (tokens, credenciales de biometría). AsyncStorage solo para lo no sensible. Credenciales temporales de biometría en Zustand en memoria, 60 s. Caché de imágenes con FileSystem. La contraseña no se guarda nunca.
- **Refresh:** único y compartido en `BaseHttpClient` (Core rota el refresh token). Tras cada refresh correcto, actualiza también el refresh token de la biometría.
- **Multi-club:** la identidad de una sede es `db_id` + `club_id`. Toda query key de datos de club lleva los dos.
- **Formularios:** react-hook-form + `zodResolver` sobre el schema del contrato; mensajes como claves de i18n.
- **Fechas:** en la zona horaria del club; "ahora" sale de `serverClock`.
- **i18n:** todo texto visible en `shared/locales/`, en los 6 idiomas (es, en, pt, ca, de, fr). En componentes, `useTranslation()`; las claves están tipadas.
- **Tema:** colores y tamaños solo desde los tokens (`useTheme()`, `makeStyles()`); colores de marca solo en `shared/config/brand.js`, translúcidos con `withAlpha`. Por ahora solo tema oscuro (fijo). Usa los componentes base de `shared/components/` antes de crear otros.
- **Versionado:** versión SemVer manual en `app.config.js` y `package.json`, igual en Android e iOS. El build (`versionCode` / `buildNumber`) lo sube EAS: no lo toques. Un OTA no cambia la versión.
- **Plataforma:** R8 activo en release de Android (`expo-build-properties`); si una librería nativa se rompe en release, reglas en `extraProguardRules`. Mínimos de Android/iOS: los del SDK, no se fijan a mano. Vertical en móvil, pero pantallas responsive (Android 16 deja girar en tablets). Edge-to-edge obligatorio: usa safe areas, no las APIs antiguas de barra de estado.
- **Dependencias:** respeta `minimumReleaseAge` de pnpm; nunca añadas `minimumReleaseAgeExclude`. Si una versión es demasiado reciente, instala la anterior.
- **Finales de línea:** no toques `.gitattributes`; git no convierte finales de línea en este repo (el fingerprint depende de ello).

## Receta: pantalla nueva

1. Rama `feature/<pantalla>` desde `dev`.
2. Scalar → `schemas/` → `services/` (endpoints + query keys) → `hooks/` (con `CachePolicy`) → `components/` → `<X>Screen.tsx` → `index.ts`.
3. Ruta en `src/app/`.
4. Textos en los 6 idiomas.
5. Tests en la ruta espejo.
6. Definition of Done → PR a `dev`.

## Git

- `feature/*` y `fix/*` desde `dev` → PR a `dev`. `dev → master` solo en release. Nada de push directo a `dev` ni `master`.
- Conventional Commits en español con scope y el porqué: `feat(asistencia): …`, `fix(sign-in): …`.
- Release: `chore(release): X.Y.Z` + etiqueta `vX.Y.Z`.

## Definition of Done

- [ ] Estructura respetada: todo en su feature, lo compartido en `shared/<tipo>/`, sin imports entre features.
- [ ] `pnpm typecheck` (app y tests) y `pnpm lint` sin errores.
- [ ] Tests en la ruta espejo, pasando.
- [ ] Textos en los 6 idiomas; ninguno hardcodeado.
- [ ] Contrato comprobado en Scalar, o mock + petición en `docs/endpoints-pendientes/`; tabla de endpoints actualizada.
- [ ] Errores RFC 9457 traducidos por `type`.
- [ ] `CachePolicy` en cada query; invalidación tras cada mutación.
- [ ] Probado en Android e iOS (tema oscuro).
- [ ] Ningún secreto ni `.env` en el diff.
- [ ] Commit con el formato del equipo.
