# Guía de trabajo — Playtopia Pro (app Profesor)

App móvil para los profesores de Playtopia (repo `PlaytopiaAppPro`), hermana de la app de alumnos (`PlaytopiaAppStudent`). Comparte stack, backend (Core_Playtopia) e infraestructura; tiene su propia estructura por features y sus propias pantallas.

Esta guía es la referencia de **cómo se trabaja** en este repo. El resumen accionable para Claude Code está en [`CLAUDE.md`](../CLAUDE.md), en la raíz del repo.

## Índice

1. [Stack](#1-stack)
2. [Estructura de carpetas](#2-estructura-de-carpetas)
3. [Principios: SOLID y DRY](#3-principios-solid-y-dry)
4. [Endpoints del backend: Scalar de Core](#4-endpoints-del-backend-scalar-de-core)
5. [Secretos y variables de entorno](#5-secretos-y-variables-de-entorno)
6. [Manejo de errores: RFC 9457](#6-manejo-de-errores-rfc-9457)
7. [Caché con TanStack Query](#7-caché-con-tanstack-query)
8. [Sesión, almacenamiento y sucursales](#8-sesión-almacenamiento-y-sucursales)
9. [Formularios](#9-formularios)
10. [Estrategia de tests](#10-estrategia-de-tests)
11. [Fechas y zona horaria](#11-fechas-y-zona-horaria)
12. [i18n](#12-i18n)
13. [Tema y diseño](#13-tema-y-diseño)
14. [Versionado (Android e iOS)](#14-versionado-android-e-ios)
15. [Flujo de Git](#15-flujo-de-git)
16. [Definition of Done](#16-definition-of-done)
17. [Arranque del repo: de cero, trayendo solo lo necesario](#17-arranque-del-repo-de-cero-trayendo-solo-lo-necesario)
18. [Receta: crear una pantalla nueva](#18-receta-crear-una-pantalla-nueva)
19. [Publicación](#19-publicación)

---

## 1. Stack

| Pieza | Versión / herramienta |
|---|---|
| Framework | Expo SDK 57, React Native 0.86, React 19.2, New Architecture. Se prueba con Expo Go (que solo abre el último SDK) o con development build |
| Navegación | expo-router 57 (grupos protegidos con `Stack.Protected`; pestañas con `expo-router/ui`) |
| Datos de servidor | TanStack Query 5 + axios |
| Contratos y validación | Zod 4 |
| Estado de UI | Zustand 5 |
| Formularios | react-hook-form + `@hookform/resolvers` (zodResolver) |
| i18n | i18n-js (es, en, pt, ca, de, fr) |
| Fechas | dayjs (utc, timezone) |
| Animación | react-native-reanimated 4 (con react-native-worklets) |
| Desenfoque | expo-blur (velo de los paneles inferiores) |
| Biometría | expo-local-authentication + expo-secure-store |
| Barra de navegación (Android) | expo-navigation-bar (solo su plugin) |
| Gráficos e iconos | react-native-svg; iconos de `@playtopia/icons` (librería propia, repo IconsPlaytopia) |
| Fuentes | Sora (títulos) e Inter (texto), de `@expo-google-fonts`, cargadas con expo-font |
| Vibración | expo-haptics |
| Observabilidad | Sentry |
| Actualizaciones | expo-updates (OTA), `runtimeVersion` con policy `fingerprint` |
| Tests | Jest (jest-expo) + Testing Library |
| Lenguaje | TypeScript 6 `strict` (sin `baseUrl`: `paths` relativos) |
| Gestor de paquetes | **pnpm 11**, versión fijada en `packageManager` de `package.json` |
| Mínimos de plataforma | Los del SDK, sin fijar a mano: hoy Android minSdk 24, target/compile 36; iOS 16.4. Se actualizan solos al subir de SDK; solo se fijan en `expo-build-properties` si una librería lo exige |

Sobre pnpm: `scripts/only-pnpm.js` corta cualquier instalación que no sea con pnpm. La versión exacta se fija en `packageManager` porque EAS Build y corepack instalan la que declara ese campo; tiene que coincidir con la que usa el equipo en local.

Los ajustes de pnpm 11 van en `pnpm-workspace.yaml` (ya no se leen de `.npmrc`):
- `nodeLinker: hoisted`: `node_modules` en plano, como espera el autolinking nativo de React Native.
- `allowBuilds`: aquí se aprueba (`true`) o se deniega (`false`) cada dependencia con script de instalación. Una dependencia nueva con script para la instalación hasta que se decide.
- `minimumReleaseAge` (política de cadena de suministro de pnpm 11, activa por defecto): pnpm no instala versiones publicadas hace muy poco, que es cuando una versión maliciosa todavía no se ha detectado. **No se añaden excepciones** (`minimumReleaseAgeExclude`): si una versión es demasiado reciente, se usa la anterior. Si pnpm añade una excepción por su cuenta, se quita y se reinstala.
  - **Única excepción: `@playtopia/icons`**, la librería propia, que se publica desde su propio workflow con procedencia verificada. Va limitada a la versión exacta (`'@playtopia/icons@1.8.0'`) con un comentario, y se actualiza al subir de versión.

---

## 2. Estructura de carpetas

**Una feature = una pantalla o un flujo completo de la app** (p. ej. `auth`: email → contraseña → registro / recuperar contraseña → sesión abierta). Dentro lleva todo lo que esa pantalla o flujo necesita. Lo que usan dos o más features va en `shared/`, y nunca como archivo suelto: va en la carpeta de su tipo, igual que dentro de una feature.

```
src/
  app/                   rutas expo-router, solo montan la pantalla
    _layout.tsx
    (auth)/              sign-in, password, sign-up, password-recovery
    (app)/               pantallas con sesión: un Stack con el menú y, encima, los detalles
      (tabs)/            menú inferior: index (Hoy), calendar, groups, network, profile
  features/
    auth/                = flujo de acceso (varias pantallas)
      components/        AuthLayout, PasswordInput, FormError
      hooks/             useCheckEmail, useSignIn…
      services/          una interfaz por caso de uso
      schemas/
      store/             estado del flujo (email entre pasos)
      SignInScreen.tsx  PasswordScreen.tsx  …
      index.ts
    home/                = pantalla Home
      components/
      hooks/
      services/
      schemas/
      store/             solo si la pantalla tiene estado de UI propio (Zustand)
      HomeScreen.tsx
      index.ts
    ...                  una carpeta por pantalla o flujo
  shared/                lo usado por 2 o más features, por tipo
    components/          Button, ErrorState, LoadingState, Navbar…
    hooks/               useNetworkStatus, useAppUpdates…
    services/            httpClient, tokenStorage
    schemas/             schemas comunes (ProblemDetail…)
    store/               sesión y sucursal activa (Zustand)
    locales/             diccionario compartido: es, en, pt, ca, de, fr
    config/              env, queryClient, cachePolicies, i18n, theme, sentry
    utils/               logger, fechas, formato, serverClock, imageCache
__tests__/               espejo de src/
  features/
    auth/
      hooks/useSignIn.test.tsx
      services/signInService.test.ts
      SignInScreen.test.tsx
  shared/
    services/httpClient.test.ts
    hooks/useNetworkStatus.test.ts
  helpers/               renderWithProviders, factories, fixtures
  setup/                 setup común de Jest
__mocks__/               mocks de módulos nativos
docs/
  GUIA_APP_PROFESOR.md   esta guía
  endpoints-pendientes/  una petición a Core por endpoint que falta
assets/
scripts/
```

### Reglas

1. **Una feature por pantalla o por flujo.** Dentro van sus `components/`, `hooks/`, `services/` (con sus endpoints y query keys), `schemas/`, `store/` si hace falta, sus `<X>Screen.tsx` e `index.ts`. Un flujo agrupa las pantallas que comparten datos y piezas (como `auth`) para no repartir su lógica entre features.
2. **No hay carpetas por tipo en la raíz de `src/`** (`src/services/`, `src/hooks/`…). O algo es de una feature, o está en `shared/<tipo>/`.
3. **`shared/` solo recibe lo que usan dos o más features**, y siempre en la carpeta de su tipo: un componente compartido va a `shared/components/`, un hook a `shared/hooks/`, un service a `shared/services/`, un schema a `shared/schemas/`. No hay archivos sueltos en `shared/`. Mientras algo lo use una sola feature, se queda en ella.
4. **`shared/` nunca importa de `features/`**, y una feature no importa de otra feature.
5. **`app/` solo contiene rutas**: importa `<X>Screen` desde el `index.ts` de la feature. Sin lógica.
6. **Nombres**: carpetas de feature en kebab-case, componentes y pantallas en PascalCase, hooks `useX`, siempre `index.ts`.
7. **Un solo alias**: `@/` apunta a `src/`.
8. **Estado**:
   - Lo que viene del servidor vive **solo** en TanStack Query. Nunca se copia a Zustand.
   - Zustand es para estado de UI (filtros, modo edición, pestaña activa). Va en `features/<x>/store/` si lo usa una pantalla y en `shared/store/` si lo usan varias. La sesión y la sucursal activa van en `shared/store/`.
   - Un store por responsabilidad, con selectores (`useStore((s) => s.campo)`) para no re-renderizar de más.
   - Solo se persiste con AsyncStorage (`persist` + `createJSONStorage`) lo no sensible que tiene que sobrevivir a reiniciar la app. Los tokens van en SecureStore (ver [sección 8](#8-sesión-almacenamiento-y-sucursales)).

### Tests: espejo de `src/`

A `src/features/auth/hooks/useSignIn.ts` le corresponde `__tests__/features/auth/hooks/useSignIn.test.tsx`. Si se mueve o renombra un archivo, su test se mueve igual. Solo `helpers/` y `setup/` quedan fuera del espejo.

Configuración de Jest: `testMatch` apunta a `__tests__/**/*.test.(ts|tsx)`, `moduleNameMapper` traduce `^@/(.*)$` a `<rootDir>/src/$1` y `clearMocks` deja los mocks sin llamadas previas en cada test. Helpers comunes: `renderWithProviders`, `createFakeHttpClient`, `createFakeTokenStorage`, `createFakeAdapter`, `createTestJwt`.

### Pantallas iniciales

Base común que se trae de la appStudent, adaptada a profesor:

| Feature | Qué hace |
|---|---|
| `auth` | flujo de acceso completo hasta el inicio: email → contraseña (login contra `/api/auth/login/teacher`) → aceptar los términos vigentes, registro con firma HMAC, recuperar contraseña con `scope: "teacher"`, biometría y elegir sucursal |
| `profile` | ver y editar perfil, avatar, cambiar contraseña |
| `settings` | idioma, notificaciones, borrar cuenta |
| `notifications` | notificaciones push |

Las pantallas propias del profesor (clases, alumnos, asistencia, calendario…) están **pendientes de definir**.

---

## 3. Principios: SOLID y DRY

Toda la app se escribe con SOLID y DRY.

### SOLID

- **S — Responsabilidad única.** Cada archivo hace una cosa:
  - `schemas/`: contrato y tipos.
  - `services/`: llamada HTTP y validación con Zod.
  - `hooks/`: caché y estado (TanStack Query).
  - `components/`: pintar.
  - `<X>Screen.tsx`: componer.
  - El formateo y los cálculos van a funciones puras (`shared/utils/` o dentro de la feature), no al service ni al componente.
- **O — Abierto/cerrado.** Se extiende sin modificar. Ejemplo: `BaseHttpClient` y las clases que lo heredan (`httpClient`, `uploadHttpClient`). Para variantes, mapas de configuración en lugar de `switch` que haya que tocar en cada caso nuevo.
- **L — Sustitución de Liskov.** Cualquier implementación de una interfaz de service (`IXService`) se puede sustituir por otra —un mock, por ejemplo— sin que el hook note la diferencia. Es lo que permite la regla de mocks de la [sección 4](#si-el-endpoint-no-existe-o-no-devuelve-lo-necesario-mock--petición-a-core).
- **I — Segregación de interfaces.** Interfaces pequeñas por service y props mínimas por componente. Nada de objetos "dios" pasados enteros a todos los componentes.
- **D — Inversión de dependencias.** Los hooks dependen de la interfaz del service; el service depende de `IHttpClient`, no de axios. Patrón: clase + interfaz + singleton exportado.

```ts
// features/profile/services/profileService.ts
export interface IProfileService {
  getProfile(id: number): Promise<TeacherProfile>;
}

class ProfileService implements IProfileService {
  constructor(private readonly http: IHttpClient) {}

  async getProfile(id: number): Promise<TeacherProfile> {
    const data = await this.http.get<unknown>(PROFILE_ENDPOINTS.byId(id));
    return validateTeacherProfile(data);
  }
}

export const profileService: IProfileService = new ProfileService(httpClient);
```

### DRY

- Cada dato tiene una sola definición:
  - **endpoint**: en el `services/` de su feature;
  - **tipo**: sale de `z.infer` del schema, sin interfaces duplicadas a mano;
  - **query keys**: en una factory por feature;
  - **textos**: en `shared/locales/`;
  - **regla de negocio**: en una sola función.
- **La regla de la segunda vez:** algo se escribe en la feature que lo usa y, cuando lo necesita una segunda pantalla, se mueve a `shared/<tipo>/`. No se copia ni se abstrae antes de tiempo.

---

## 4. Endpoints del backend: Scalar de Core

Core_Playtopia documenta todos sus endpoints con **Scalar** (OpenAPI 3.1, generado con utoipa). Es la referencia para decidir qué endpoints usa la app y para escribir sus schemas.

### Servidor de trabajo: dev cloud

Toda la app trabaja contra el servidor de desarrollo:

| Qué | URL |
|---|---|
| API | `https://core-dev.playtopiax.com/api` (`EXPO_PUBLIC_API_BASE_URL`) |
| Scalar | **`https://core-dev.playtopiax.com/docs`** (en la raíz del servidor, no bajo `/api`) |

Scalar se activa con `ENABLE_API_DOCS=true` en el entorno de Core. **Nunca se activa en producción** (`core-api.playtopiax.com`), porque expone el esquema completo sin autenticación.

### Flujo de trabajo

1. Buscar el endpoint en Scalar.
2. Copiar el contrato (request, response y códigos de error) al `schemas/` de la feature con Zod, en snake_case como lo devuelve Core.
3. Anotar el endpoint en el `services/` de la feature.
4. Añadirlo a la tabla de **Endpoints en uso**.

Grupos de Scalar útiles para el profesor: *Auth*, *Users → Teachers*, *School & Classes*, *Catalog → Calendar*, *Push*.

### Endpoints en uso

Tabla viva: se actualiza cada vez que una pantalla empieza a usar un endpoint o un mock pasa a real.

| Método | Ruta | Feature | Estado |
|---|---|---|---|
| POST | `/api/auth/login/teacher` | auth (contraseña) | real |
| POST | `/api/auth/refresh` | shared (httpClient) | real |
| POST | `/api/auth/check-email` | auth (email) | real |
| POST | `/api/UserTeacher` | auth (registro) | real |
| POST | `/api/PassRecovery/request` (con `scope: "teacher"`) | auth (recuperar) | real |
| POST | `/api/PassRecovery/validate` | la web de recuperación, no la app | real |
| GET | `/api/UserTeacher/{id}` | auth (términos tras el login), profile | real |
| PATCH | `/api/UserTeacher/{id}` | auth (aceptar términos), profile | real |
| DELETE | `/api/UserTeacher/{id}` | settings (borrar cuenta) | real |
| PATCH | `/api/UserTeacher/password` | profile | real |
| GET | `/api/MobileTeacher/avatar` | profile | real |
| POST | `/api/MobileTeacher/UploadMobileTeacherAvatar` (multipart, campo `avatarFile`) | profile | real |

Clases, alumnos, asistencia, calendario y la lista de clubes del profesor **todavía no tienen endpoints `Mobile`** en Core: se construyen con la regla siguiente.

### Si el endpoint no existe o no devuelve lo necesario: mock + petición a Core

**Una pantalla nunca se para por falta de endpoint.** Se construye entera contra un mock que respeta el contrato esperado y, en paralelo, se documenta lo que Core tiene que hacer. Cuando Core lo publica, solo queda llamar y conectar.

**1. Contrato primero.** El schema Zod en `features/<x>/schemas/` describe la respuesta que la pantalla necesita, con las convenciones de Core: snake_case, importes en céntimos, fechas ISO y errores `ProblemDetail`.

**2. Dos implementaciones de la misma interfaz:**

```
features/<x>/services/
  xService.ts          interfaz IXService + implementación real (httpClient)
  xService.mock.ts     implementación mock: datos de ejemplo + latencia simulada
  index.ts             export const xService = X_USE_MOCK ? xMockService : xRealService
```

- El mock **pasa por el mismo `validate*` del schema**, así el contrato no se desvía.
- El interruptor va por endpoint, no es global: nunca se mockea lo que ya existe.
- Cada mock lleva el comentario `// MOCK: pendiente en Core, ver docs/endpoints-pendientes/<archivo>.md`, para localizarlos con un grep.
- Hooks, componentes y pantalla no saben si detrás hay mock o servidor real.
- Cuando simula un fallo, el mock devuelve un `ProblemDetail` válido.

**3. Petición para Core** en `docs/endpoints-pendientes/<feature>-<accion>.md`:

```markdown
# <Acción> — <feature>

- **Estado:** pendiente | en desarrollo | publicado en dev
- **Pantalla que lo necesita y para qué:** …
- **Método y ruta propuesta:** GET /api/Mobile/…
- **Rol:** JWT de profesor (role_id = 4)
- **Tag de Scalar sugerido:** …
- **Parámetros (ruta / query):** …
- **Body de request:** …
- **Respuesta 200:** (JSON idéntico al del mock)
- **Errores:** 400 / 401 / 403 / 404 / 409, con el `type` (`urn:playtopia:problem:…`) que debería crear Core para cada uno
- **Reglas de negocio y permisos:** qué puede ver y hacer cada profesor
- **Si el endpoint ya existe pero no basta:** qué campos faltan o qué cambia
```

**4. Conexión cuando Core lo publica:**

1. Comprobar en Scalar que el contrato coincide.
2. Poner `X_USE_MOCK = false`.
3. Borrar el `.mock.ts`.
4. Marcar el endpoint como `real` en la tabla y la petición como publicada.

No se toca nada más de la pantalla.

**5. Tests:** el test del service real mockea `httpClient`. El JSON del mock se reutiliza como fixture en `__tests__/helpers/`.

---

## 5. Secretos y variables de entorno

**Al repositorio no se sube ningún secreto.** Todo valor sensible o propio de un entorno entra por variables de entorno, sin excepción.

- **En el repo solo se sube `.env.example`**, con todas las claves y valores de relleno. `.gitignore` bloquea `.env`, `.env.*` y `.env*.local`, con la excepción `!.env.example`.
- **Nada hardcodeado**: ni URLs de servidor, ni claves, ni DSN de Sentry, ni IDs de proyecto.
- **Validación al arrancar:** `shared/config/env.ts` valida todas las variables con un schema Zod. Si falta o está mal alguna, la app falla en el arranque con un mensaje claro. El resto del código importa `env` desde ahí y **nunca lee `process.env` directamente**.

Cómo está hecho (`src/shared/config/env.ts`):
- Un schema Zod con todas las variables; `parseEnv()` lo aplica y, si algo falla, lanza un error que nombra cada variable mal o ausente.
- Una variable vacía en `.env` (`CLAVE=`) cuenta como no definida.
- El layout raíz lo importa, así la validación ocurre al arrancar y no en una pantalla cualquiera.
- Una variable que solo necesita una pantalla futura se declara opcional y pasa a obligatoria cuando esa pantalla existe. Así pasó con el secreto HMAC: es obligatorio desde que existe `sign-up`.
- Para una variable nueva: añadirla al schema, a la llamada de `parseEnv`, a `.env.example` y a las variables de EAS.

> Expo solo sustituye `process.env.EXPO_PUBLIC_X` cuando se escribe literal, por eso cada variable se nombra una a una.

### `EXPO_PUBLIC_*` no es un sitio para secretos

Estas variables se incrustan en el bundle y cualquiera puede leerlas desde la app instalada. Solo sirven para valores públicos (URL de la API, DSN, claves publicables). Los secretos de verdad **nunca van a la app**:

- token de Sentry para subir sourcemaps;
- credenciales de tiendas;
- tokens de EAS.

Esos viven en las **variables/secretos de EAS**, separadas por entorno (development, preview, production).

### Firma HMAC del registro (`registration_token`)

`POST /api/UserTeacher` exige un `registration_token` con formato `v1.{timestamp}.{hash}` (HMAC-SHA256 con `crypto-js`), firmado con el secreto compartido que Core valida con su `backend_shared_secret`.

- El secreto entra **solo por env** (`EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET`, más `EXPO_PUBLIC_TOKEN_SKEW_SECONDS`, por defecto 300). Su valor vive en las variables de EAS y en el `.env` local, **nunca en el repo**. Core valida el alta de alumno y la de profesor con el mismo `backend_shared_secret`, así que el valor es el mismo que `EXPO_PUBLIC_USER_STUDENT_SHARED_SECRET` de la app de alumnos.
- Es una **firma de origen** para frenar altas automáticas, no un secreto fuerte: al ser `EXPO_PUBLIC_*`, va dentro del bundle. Si se filtra, se rota en Core y en EAS a la vez.
- El timestamp sale de `serverClock` para no fallar por la desviación del reloj del móvil. Antes del registro el profesor pasa por `check-email`, cuya respuesta ya calibra la hora de Core.
- Código: `features/auth/services/registrationToken.ts`. Su test reproduce la validación de Core con el HMAC de Node.
- No hay reintento por token caducado: Core devuelve ese caso como `about:blank` y solo se distinguiría leyendo el `detail`. Está pedido en `docs/endpoints-pendientes/auth-registro-types.md`.

### Ficheros de credenciales

- `google-services.json` se entrega como **variable de tipo fichero de EAS** (`GOOGLE_SERVICES_JSON`), y `app.config.js` la lee con `process.env.GOOGLE_SERVICES_JSON`.
- Keystores, `.p8`, `.jks` y certificados se gestionan en las credenciales de EAS y están en `.gitignore`.

### Antes de cada commit

Se revisa `git status` y el diff para que no entre ningún `.env` ni ninguna clave. Si se sube un secreto por error, no basta con borrarlo: **se rota**.

---

## 6. Manejo de errores: RFC 9457

Core responde **todos** sus errores con RFC 9457 (*Problem Details*, `application/problem+json`). La app trabaja con esa misma forma de principio a fin:

```json
{
  "type": "urn:playtopia:problem:<nombre>",
  "title": "…",
  "status": 409,
  "detail": "…",
  "instance": "…",
  "<extension>": {}
}
```

- **Schema único:** `shared/schemas/problemDetail.schema.ts`, con `.passthrough()` para no perder los *extension members* (§3.2 del RFC).
- **Un solo punto de conversión:** `BaseHttpClient` (`shared/services/`) convierte cualquier fallo en un `HttpError` tipado que lleva el `problem` completo.
  - Los errores sin respuesta (red o timeout) se tipifican en el mismo punto con `isNetworkError` e `isTimeout`, para que la pantalla trate un único tipo de error.
  - Ningún service ni hook hace `try/catch` para inventar su propio formato.
- **Se traduce por `type`, nunca por `detail`:**
  - el `detail` es prosa en español para logs y Scalar; no se muestra al usuario;
  - el texto visible lo da `getErrorMessage(error)` (`shared/utils/`): primero `errors.byType.<clave>` (la clave es el `type` sin `urn:playtopia:problem:`), después `errors.byStatus.<status>` (el de `500` para cualquier 5xx), y por último red, timeout o `errors.unknown`;
  - si no hay traducción para ese `type`, se usa un texto genérico por `status`.
- **Cuando la pantalla tiene que reaccionar distinto**, decide por `type` y por los *extension members* (`pending_consents`, `conflicts`…), nunca parseando texto.
- **Errores nuevos:** cada petición de `docs/endpoints-pendientes/` indica qué `type` debe crear Core para cada error.
- **Types pedidos a Core:**

  | Petición | Types | Estado |
  |---|---|---|
  | `auth-registro-types.md` | `email-already-registered`, `registration-token-expired`, `registration-token-invalid` | pendiente |
- **Sentry** recibe `type`, `status` e `instance`, para poder cruzarlo con los logs de Core.

---

## 7. Caché con TanStack Query

Los tiempos de caché no se escriben a mano en cada query, ni se usa un único valor para toda la app. Hay **políticas con nombre en un solo sitio** (`shared/config/cachePolicies.ts`) y cada query elige la suya.

| Política | Para qué | staleTime | gcTime | Refetch |
|---|---|---|---|---|
| `STATIC` | catálogos, niveles, deportes, configuración del club | 1 h | 24 h | no |
| `STANDARD` (por defecto) | perfil, listados normales | 5 min | 10 min | al reconectar |
| `LIVE` | datos que cambia otro actor (el club, un alumno): asistencia, inscritos | 30 s | 5 min | al volver a la app y al reconectar |
| `POLLING(ms, cuándo)` | pantallas que esperan un cambio externo | 0 | 5 min | `refetchInterval` solo mientras se cumpla la condición |
| `ALWAYS_FRESH` | lo que nunca puede verse viejo: versión de la app, normativas | 0 | 5 min | al montar |

```ts
useQuery({
  queryKey: attendanceKeys.byClass(dbId, clubId, classId),
  queryFn: () => attendanceService.getByClass(classId),
  ...CachePolicy.LIVE,
});

// POLLING es una factory
...CachePolicy.POLLING(30_000, (data) => data.items.some((i) => i.pending))
```

- **Valores por defecto del `queryClient`** = `STANDARD`. Además, el `retry` no reintenta en 4xx (se sabe por el `status` del `ProblemDetail`) y sí en red, timeout o 5xx, con backoff.
- **Salirse de una política** solo con un comentario que explique el porqué. Si la misma excepción aparece en una segunda pantalla, se convierte en una política nueva.
- **Tras una mutación no se baja el staleTime: se invalida** con las keys de la factory de la feature, o se actualiza la caché de forma optimista.

---

## 8. Sesión, almacenamiento y sucursales

### Login: email y contraseña

- **Paso 1, email** (`SignInScreen`): `POST /api/auth/check-email`. Si `is_teacher`, pasa a la contraseña; si no, ofrece crear la cuenta. Un email que solo es de alumno tampoco pasa a la contraseña: la cuenta de profesor es otra.
- **Paso 2, contraseña** (`PasswordScreen`): login con `{ username: email, password }`. Un 401 es "credenciales incorrectas"; si el email también es de alumno, se aclara que la contraseña es la de la cuenta de profesor.
- **Un alumno puede ser profesor:** son cuentas separadas en Core (tablas distintas, cada una con su contraseña) y el JWT lleva un solo rol. El alumno que aún no es profesor ve «Registrarse» en el paso 1 y puede darse de alta con el mismo email: Core solo rechaza el alta si el email ya es de otro profesor.
- **Al volver al paso 1** (p. ej. tras registrarse), el botón vuelve a «Continuar» y el email sigue escrito.
- **Paso 3, términos:** tras el login se lee `GET /api/UserTeacher/{id}`. Si `terms_version` es la vigente, `session.start()` abre la sesión y los guards llevan solos al inicio: las pantallas no navegan al inicio. Si no (null por alta desde el CRM, o una versión anterior), ver «Aceptación de términos».

- `POST /api/auth/login/teacher` con cuerpo **`{ username, password }`** (el campo se llama `username`, no `email`). Devuelve `access_token`, `refresh_token`, `id`, `role_id` y `db_id`.
- **Rol del profesor: `4`** (`ROLES.TEACHER` en `shared/config/roles.ts`, copia de `crates/shared/src/roles.rs`). La fuente de verdad es el claim `RoleId` del JWT; Core responde 403 si no coincide.
- El access token de las apps móviles **dura 60 minutos**; el refresh token es de un solo uso y Core lo rota.
- Los tokens se guardan en **SecureStore** mediante `shared/services/tokenStorage`.
- **Refresh:** lo hace `BaseHttpClient`. Ante un 401 llama una sola vez a `/api/auth/refresh` y reintenta la request original. La promesa de refresh es compartida: el refresh token es de un solo uso y Core lo rota, así que varios 401 a la vez no pueden disparar varios refresh.
  - Refresh rechazado → se cierra la sesión.
  - Fallo de red durante el refresh → **no** se saca al usuario al login.

### Registro

- `SignUpScreen` (ruta `sign-up`), igual que el registro de la app de alumnos: sin logo, con botón de volver y el título «¡Regístrate!». No pide documento ni adulto/niño.
- **Campos:** nombre, apellidos, email (llega ya escrito desde el paso 1), teléfono con selector de país, fecha de nacimiento (selector nativo), género, contraseña, repetirla y la casilla de términos (sus enlaces abren `LegalModal`).
- **Validación:** un solo schema Zod (`SignUpFormSchema`) con `mode: "onTouched"`. El error de un campo sale al dejarlo y se corrige al escribir. El botón queda gris hasta que todo es válido.
- **Envío** (`toSignUpRequest` y `signUpService`): `POST /api/UserTeacher` con `name`, `last_name`, `email`, `password`, `phone_number` con prefijo (`+34612345678`), `birthday` (`YYYY-MM-DDT00:00:00`), `gender`, `terms_version` (`TERMS_VERSION`) y el `registration_token` recién firmado.
- **Tras el 201** vuelve al login, igual que la app de alumnos: la respuesta trae tokens, pero no se usan. La biometría se ofrece tras ese primer login.
- **Errores:** hoy todos llegan como `about:blank` y se muestra el texto genérico de su status. Los `type` están pedidos a Core (ver «Types pedidos a Core»).

### Aceptación de términos

- `TERMS_VERSION` (`features/auth/schemas/signUp.schema.ts`) es la fecha de la versión vigente. Los documentos están en la web; se sube a mano cuando cambian.
- Si al hacer login el profesor no tiene la versión vigente, `useSignIn` guarda los tokens con `session.saveTokens()` **sin abrir la sesión**, y la pantalla de contraseña abre el `LegalModal` de los términos con el botón «Aceptar» (prop `onAccept`).
  - **Aceptar:** `PATCH /api/UserTeacher/{id}` con `terms_version` (Core sella `accepted_terms_at`) y `session.start()`.
  - **Cerrar el modal:** no entra; `session.end()` borra los tokens.
  - Si Core no guarda la aceptación, el error sale dentro del modal.
  - Si no se puede leer el perfil tras el login, no entra y se borran los tokens.
- **Límite conocido:** quien ya tiene la sesión abierta cuando sube la versión no ve el modal hasta su siguiente login. Se cubrirá cuando se pida.

### Recuperación de contraseña

- `PasswordRecoveryScreen` (ruta `password-recovery`), desde «¿Has olvidado tu contraseña?» en la pantalla de contraseña. Igual que en la app de alumnos: título, subtítulo, email **vacío** (quien recupera sabe su correo) y el botón desactivado hasta que el email es válido (`EmailFormSchema`).
- `passwordRecoveryService` llama a `POST /api/PassRecovery/request` con **`scope: "teacher"`**. Sin `scope`, si el mismo email existe como admin o alumno, Core recupera esa otra cuenta (prioridad admin > alumno > profesor).
- Siempre responde 200 `{ status: "ok" }`, exista o no el email (anti-enumeración). La pantalla muestra la misma confirmación en ambos casos, y la saca de `isSuccess` de la mutación.
- **La contraseña nueva se pone en la web**, no en la app: el correo lleva `https://playtopiax.com/passrecovery/?key=…`, y la web llama a `POST /api/PassRecovery/validate`. Core guarda en el token la tabla de la cuenta (`user_teachers`) y cambia la contraseña ahí; después revoca los refresh tokens de ese profesor.
- Por eso «Volver al Login» lleva al **primer paso** (`dismissTo("/sign-in")`): hasta cambiarla en la web no hay contraseña nueva que escribir.
- Errores por status con `getErrorMessage` (p. ej. el 429, «Demasiados intentos»). Core los manda como `about:blank` y el texto del status basta.

### Almacenamiento en el dispositivo

| Mecanismo | Qué guarda | Dónde vive el código |
|---|---|---|
| **SecureStore** (Keychain / Keystore, cifrado por el sistema) | `access_token`, `refresh_token`; credenciales de biometría (email, id del profesor y refresh token) | `shared/services/tokenStorage`, `shared/services/biometricCredentialStore` |
| **AsyncStorage** (texto plano) | solo datos **no sensibles**: perfil público mínimo (`user_public`), idioma elegido, preferencias de notificaciones (Zustand `persist`), ID de instalación para push, onboarding visto, sucursal activa | el service o store de cada caso |
| **Zustand en memoria** (sin persistir) | la oferta de activar la biometría tras el login con contraseña (email e id del profesor, **60 s**); sin tokens | `features/auth/store/biometricOfferStore` |
| **FileSystem** (`expo-file-system`) | caché de imágenes (avatares) en un directorio propio, con limpieza | `shared/utils/imageCache` |

**Regla:** si quien lo tenga puede actuar como el usuario, va en SecureStore. Todo lo demás, en AsyncStorage. **La contraseña no se guarda en ningún sitio.**

### Biometría

- **En los textos visibles siempre «biometría»**, nunca «huella»: el móvil puede usar huella, cara o su código.
- `expo-local-authentication`, opcional. Si la biometría falla, el código del móvil también vale (`disableDeviceFallback: false`). Face ID no funciona en Expo Go: en iPhone se prueba con un development build.
- **Piezas, en `features/auth/`:**
  - `biometricService`: solo sensor y almacén. Si el móvil puede usarla, activarla (verifica y guarda), desbloquear (verifica y devuelve lo guardado), el email guardado y desactivarla.
  - `useBiometricStatus`: si el móvil puede usarla y para qué email está activada. La comparten los dos hooks siguientes.
  - `useBiometricSignIn`: entrar con biometría en la pantalla del email.
  - `useBiometricOffer` + `BiometricOfferModal`: la oferta de activarla.
- **Guardado** (`shared/services/biometricCredentialStore`): email, id del profesor y refresh token, en SecureStore. La contraseña nunca.
- **Token al día:** Core rota el refresh token en cada `/auth/refresh`. `tokenStorage.setTokens()` es el único sitio que actualiza la copia de la biometría (`updateRefreshToken`), en cada login y renovación, y solo si los tokens son del mismo profesor. Un fallo ahí nunca impide abrir o renovar la sesión.

**Ofrecerla**
- Solo el login con contraseña deja la oferta (`biometricOfferStore`, en memoria): email e id del profesor, durante **60 s**. Sin tokens: el refresh token se lee de SecureStore al activarla, así es el vigente.
- El registro no la ofrece porque no abre sesión: tras el alta el profesor entra con su contraseña y ese login la ofrece.
- El panel (`BiometricOfferModal`, un `BottomSheet`) se monta en `(app)/_layout.tsx`: aparece encima de Hoy, ya con la sesión abierta. Se muestra una vez si la oferta sigue vigente, **es del profesor con la sesión abierta**, el móvil puede usarla y esa cuenta no la tiene ya. Si la tiene otra cuenta, activarla la sustituye.
- La oferta de un profesor que cerró sesión sin responderla no vale para el siguiente: se descarta al mostrarla y otra vez al activarla. Si no, se guardaría el email de uno con la sesión del otro.
- **Resultados con `Alert` nativo:** activada → se cierra el panel y avisa; falla o el móvil ya no puede usarla → avisa y el panel sigue abierto para reintentar; la oferta caducó → avisa y se cierra; cancelar el diálogo del sistema → nada.
- «Ahora no», la X, tocar fuera y el botón atrás de Android equivalen: se cierra y no se vuelve a ofrecer.

**Entrar**
- En la pantalla del email: el email guardado aparece ya escrito, la biometría se lanza sola al abrir y el botón pasa a «Acceder con biometría» mientras el email escrito sea el guardado.
- Si sale bien, se renueva la sesión con el refresh token guardado y se termina como el login con contraseña (`completeSignIn`: términos y abrir la sesión).
- Si Core rechaza el token guardado, se desactiva y se pide la contraseña; sin red, avisa y se conserva; tras 3 fallos seguidos, se pide la contraseña.

**Cerrar sesión**
- Cerrar sesión **conserva la biometría** (como la app de alumnos). Justo después de un cierre manual (`endReason: "manual"`) no se lanza sola, para no volver a entrar en la cuenta que se acaba de cerrar; el botón sigue ahí. Al volver a abrir la app sí se lanza sola.

- Permisos: `NSFaceIDUsageDescription` en los 6 idiomas (`shared/locales/native.js`) en iOS; `USE_BIOMETRIC` en Android.

### Estado de la sesión (`shared/services/session.ts`)

- **El token es la única fuente** de quién es el usuario: de sus claims (`decodeSessionClaims`, `shared/utils/jwt.ts`) salen `RoleId`, `UserId` y `DbId`. No se guardan aparte. Los claims se leen sin verificar la firma, solo para decidir la navegación: quien verifica es Core en cada petición.
- **`ClubId` del JWT no se usa:** Core lo rellena con el `db_id` (la escuela), no con la sucursal.
- `sessionStore` (Zustand) guarda solo el estado (`checking`, `authenticated`, `anonymous`) y `{ userId, dbId }`. Nunca tokens.
- **`session.restore()`** al arrancar: manda que haya **refresh token** (el access token lo normal es que esté caducado, dura 60 min) y que el rol sea 4. Si no, se cierra la sesión. Si el Keychain falla, se muestra el login **sin borrar** los tokens.
- **`session.start(access, refresh)`** tras el login: guarda los tokens y abre la sesión si el token es de profesor.
- **`session.saveTokens(access, refresh)`** guarda los tokens sin abrir la sesión: las peticiones ya van autenticadas, pero los guards no llevan al inicio. Se usa mientras el profesor acepta los términos.
- **`session.end(reason)`** es el **único sitio** que cierra la sesión: borra los tokens, vacía la caché y deja el estado en `anonymous`, con el motivo en `endReason`: `manual` (por defecto: cerrar sesión, no aceptar los términos) o `expired` (Core la dio por muerta, o el token no era de profesor). Vive en memoria. No toca la biometría. Lo usan el aviso de sesión expirada del cliente HTTP (que solo avisa) y el botón de cerrar sesión. Con push se ampliará aquí.
- **`useAppReady()`** es la única puerta de arranque: espera al idioma guardado y a la sesión; hasta entonces sigue el splash nativo.

### Guards de navegación

- En el layout raíz, con **`Stack.Protected`** de expo-router: con sesión solo existe el grupo `(app)`; sin ella, solo `(auth)`. Una ruta protegida ni se monta sin sesión, y al cerrar la sesión la app vuelve sola al login.
- **`(auth)`:** cada pantalla entra deslizándose desde la derecha (`animation: "slide_from_right"`, como la app de alumnos) sobre el fondo del tema (`contentStyle`). En Android la animación por defecto es un fundido corto que se ve de golpe.
- **`(app)`:** las pantallas van dentro de un `BlurTarget` y los paneles inferiores fuera, encima (ver «Paneles inferiores» en la sección 13).

### Menú inferior (pestañas)

- **Cinco pestañas:** Hoy (`index`), Agenda (`calendar`), Grupos (`groups`), Red (`network`) y Perfil (`profile`). Las rutas van en inglés, como el resto del código; lo que ve el usuario sale de `tabs.*` en los 6 idiomas (nunca spanglish: «Red», no «Network»).
- **Una sola lista:** `shared/config/tabs.ts` (`TABS`: nombre, `href`, texto e icono `IconLo…`). La usan la navegación, la barra, el «Próximamente» y los tests. `tabIndexForPath()` da la pestaña de una ruta (el inicio solo con `/`; las demás, también con sus subrutas).
- **Piezas, en `shared/components/`:** `AppTabs` monta la navegación con `expo-router/ui` (`Tabs`, `TabSlot`, `TabList` y un `TabTrigger` por pestaña: tienen que ir dentro de `TabList`, que es donde `Tabs` los busca); `TabBar`, la píldora de cristal flotante con la gota; `TabButton`, cada pestaña (icono y nombre; vibra al cambiar a otra, no al tocar la activa). La ruta `(tabs)/_layout.tsx` solo reexporta `AppTabs`.
- **La barra se monta una vez** y queda fija mientras cambia la pantalla de encima. `(app)` sigue siendo un `Stack` con `(tabs)` dentro: las pantallas de detalle se abrirán encima, a pantalla completa y sin barra.
- **La gota** (degradado de marca bajo la pestaña activa) es un único indicador en `TabBar`: su posición sale de `onLayout` (ancho ÷ número de pestañas) y salta con anticipación, muelle, estela y brillo (valores en `TabBar.animation.ts`). Con «reducir movimiento» va directa.
- **Hueco bajo la barra:** como flota sobre el contenido, cada pantalla del menú deja abajo `useTabBarInset()` para que no quede nada tapado.
- **Pestaña sin contenido:** su ruta reexporta `ComingSoonScreen`, que muestra el nombre de la pestaña (de `TABS`, según la ruta) y «Próximamente».

### Escuela y sucursal

- En Core, **`db_id` es la escuela** (tenant) y **`club_id` una sucursal** de esa escuela. La identidad de una sede son los dos juntos.
- Si un profesor trabaja en varias sucursales, la app mantiene una **sucursal activa** en `shared/store/` (persistida, para que al abrir la app siga la última elegida) y un selector para cambiarla.
- **Todas las query keys de datos de sucursal incluyen `db_id` y `club_id`**, así los datos de dos sucursales nunca se mezclan en caché.
- La lista de sucursales del profesor está **pendiente** en Core: se hace con mock + petición. La zona horaria es por escuela (ver sección 11).

---

## 9. Formularios

- Todos usan **react-hook-form + `zodResolver`**.
- El schema de validación sale del schema Zod del contrato en `schemas/`, sin redefinir campos. Si el formulario necesita reglas propias, se hace `.extend()` o `.pick()` sobre él.
- Los mensajes de validación son **claves de i18n**, no textos.
- Los errores del servidor (RFC 9457) se pintan con `setError` en el campo que corresponda, o como error general del formulario.
- El botón de enviar se deshabilita mientras la mutación está en curso.

---

## 10. Estrategia de tests

Siempre en la ruta espejo de `__tests__/`, con Jest y Testing Library.

| Capa | Qué se prueba |
|---|---|
| `schemas/` | acepta el contrato válido y rechaza el inválido |
| `services/` | llama al endpoint correcto con `httpClient` mockeado, valida la respuesta y propaga el `HttpError` |
| `hooks/` | estados loading, success y error, e invalidaciones tras mutar (`renderHook` + QueryClient de test) |
| `components/` | renderizado según props e interacción |
| `<X>Screen` | integración: con el service mockeado, la pantalla muestra datos, vacío y error |
| funciones puras | casos límite |

- Todo lo común vive en `__tests__/helpers/`: `renderWithProviders` (QueryClient, tema, i18n), factories de datos (`authFactories`), fixtures (los mismos JSON que los mocks de endpoints), el mock del selector de fecha (`dateTimePickerMock`) y `settle()`, que deja terminar lo que se notifica en la siguiente vuelta (validación de Zod, `reset()` de una mutación) antes de comprobar.
- **Reanimated en Jest:** `__tests__/setup/jest.setup.tsx` llama a `setUpTests()` (animaciones sin hilo nativo y el matcher `toHaveAnimatedStyle`), y `jest.config.js` usa `__tests__/setup/resolver.js`, que encadena el resolver de `react-native-worklets` (sus ficheros sin las extensiones `.native`) con el de React Native que trae jest-expo. Las animaciones se avanzan con `jest.useFakeTimers()` y `jest.advanceTimersByTime()`.
- **Jest 29.7** es la versión de jest-expo 57 (sus dependencias son `^29`). Se sube cuando Expo publique un jest-expo sobre Jest 30.
- Cada bug corregido lleva el test que lo reproduce.
- Los tests nunca llaman al servidor real.

---

## 11. Fechas y zona horaria

Así llegan las fechas de Core y así se tratan (`src/shared/utils/clubClock.ts`, espejo de `club_clock.rs` de Core, con los mismos nombres y casos de test):

| Lo que llega de Core | Qué es | Cómo se trata |
|---|---|---|
| `class_date` + `class_time` (`"2026-09-26"`, `"18:00:00"`) | **Hora de pared del club**, sin zona: las 18:00 en la pista | Se muestra tal cual (`formatClubDate`, `formatClubTime`). **Nunca** se convierte con la zona del móvil |
| Timestamps e ISO con `Z` (`created_at`, `payment_date`…) | Instante real | Se muestra en la zona del club (`formatInstant`, `toClubTime`) |

- **Zona del club:** es por escuela (`db_id`), un identificador IANA. Core no la expone todavía a la app: se usa `DEFAULT_CLUB_TIMEZONE` (`Europe/Madrid`, el mismo valor por defecto que Core) y está pedida en `docs/endpoints-pendientes/clubs-timezone.md`. Todas las funciones reciben la zona como parámetro: cuando llegue, se pasa la de la escuela de la sucursal activa.
- **"Ahora"** sale de `serverNow()` (`shared/utils/serverClock.ts`): el desfase con la hora del servidor se aprende de la cabecera `Date` de cada respuesta, así un móvil con la hora mal puesta no cambia nada.
- **¿Ya empezó una clase?** `hasClassStarted(date, time, tz)`: compara `serverNow()` con `clubInstant(date, time, tz)`, que resuelve el cambio de hora igual que Core (hora saltada → la primera que existe; hora repetida → la primera).
- **`dayjs`** (`shared/config/dayjs.ts`) solo se usa para cálculos con zonas; lo que ve el usuario se formatea con `shared/utils/formatDate.ts` (`Intl` y el idioma activo, nunca un locale fijo). Para pasar de hora de pared a instante no se usa `dayjs.tz()`: se equivoca justo después del cambio de hora, y lo detectó un test.

---

## 12. i18n

- Todo texto visible sale de `shared/locales/`. **Los 6 idiomas son obligatorios** (es, en, pt, ca, de, fr): una clave que no está en los 6 no se mergea.
- Claves agrupadas por pantalla: `signIn.title`, `home.emptyState`. Textos comunes en `common.*`; errores en `errors.byType.*` y `errors.byStatus.*` (ver [sección 6](#6-manejo-de-errores-rfc-9457)). Un `type` nuevo de Core se traduce añadiéndolo a `errors.byType` en los 6 idiomas.
- En componentes se usa el hook `useTranslation()`, que vuelve a pintar al cambiar de idioma; el `t` suelto solo fuera de React. Las claves están tipadas: una clave que no existe no compila.
- Solo se carga en memoria el diccionario del idioma activo (los 6 van en el bundle). El idioma elegido a mano se guarda en AsyncStorage (solo el código, p. ej. `"es"`) y se aplica antes de pintar la app; si no hay ninguno, se usa el del móvil y, si no está soportado, inglés.
- Nada de concatenar frases: se interpola con parámetros (`t("home.classesToday", { count })`), con plurales cuando haga falta.
- **«Biometría», nunca «huella»**, en los 6 idiomas: el móvil puede usar huella, cara o su código.

---

## 13. Tema y diseño

### De dónde sale el aspecto

- **Estilos: el prototipo de Lovable** (`playtopia-coach-pro`, en `D:\playtopia\lovable-coach-pro\`, fuera de los repos). De él se toman colores, degradados, brillos, radios, fuentes, animaciones y la disposición de las pantallas. **El código no se copia:** es web (Tailwind, Radix, TanStack Router) y se reescribe con los componentes de aquí.
- **Pantallas de acceso** (email, contraseña, registro, términos, recuperar): la disposición es la de la app de alumnos, con los colores del prototipo.

### Colores

- **Una sola paleta:** `shared/config/brand.js`, la del prototipo pasada de OKLCH a hex (React Native no entiende OKLCH). Es JavaScript plano porque también la lee `app.config.js`: el splash nativo y el fondo del icono adaptativo de Android salen de `BRAND.night`.
- **Nadie más importa `brand.js`:** el tema asigna cada color a un uso y los componentes usan `useTheme()` / `makeStyles()`. Un test falla si algún fichero importa la paleta fuera del tema, y otro si el tema escribe un color a mano (cada uno es de la paleta o una transparencia suya con `withAlpha`).
- **Tokens de color** (`theme.colors`): `background` `#0C0B1A`, `surface`, `surfaceStrong`, `card`, `elevated`, `text`, `textSecondary`, `border`, `primary` (magenta `#EF1EC1`), `accent` (violeta `#A63DF8`), `success`, `warning`, `danger`, `glass` / `glassBorder` (campos), `glassPanel` (barra de pestañas), `field`, `option`, `overlay` (velo de modal), `sheetOverlay` (velo de panel inferior, al 60 %), `hairline` / `hairlineStrong` (líneas finas), `glowPrimary`.
- **Acentos** (`theme.accents`): `gold`, `coral`, `sky` y `violet`, cada uno con su color y su degradado, para contadores y accesos rápidos.
- **Degradados** (`theme.gradients`): `brand` (`#FF2FB5` → `#C122E0` → `#8434F4`, en diagonal: botón principal y pestaña activa), `ink` (tarjetas oscuras), `modal` y `disabled`.
- **Fondo de marca** (`BrandBackground`): el color de fondo con los tres resplandores radiales del prototipo (`theme.backdrop`), dibujados con `react-native-svg`.
- **Brillos:** `glow(color)` da la sombra de brillo de cualquier color; `theme.shadows.glow` es la de marca.

### Fuentes y tipografía

- **Sora** para títulos y marca, **Inter** para el resto. Solo se cargan los pesos que se usan (Inter 400, 500, 600 y 700; Sora 700 y 800), cada uno desde su subcarpeta (`@expo-google-fonts/inter/400Regular`): el índice del paquete haría `require` de los 18 pesos de Inter y Metro los metería todos en la app.
- **Con fuentes propias el peso va en el nombre de la fuente, nunca en `fontWeight`** (en Android se ignora y sale la letra normal). `shared/config/fonts.ts` da los nombres por uso (`FONTS.regular`, `FONTS.semibold`, `FONTS.display`…) y cada variante de `theme.typography` lleva su `fontFamily`. Un test falla si alguna variante usa `fontWeight` o una fuente sin cargar.
- **Nada de estilos de letra sueltos:** si hace falta un estilo nuevo, se añade una variante con nombre de uso (`strong`, `mark`, `tab`, `tagline`, `link`…).
- Las fuentes se cargan en `useAppReady`, con el idioma, la sesión y el logo: no hay salto de letra al aparecer. Si fallan, la app arranca con las del sistema.

### Iconos

- **De `@playtopia/icons/react-native`**, la librería propia (repo `D:\playtopia\IconsPlaytopia`, publicada en npm con Trusted Publishing). Los del prototipo son los `IconLo…` (trazo fino de Lucide, prefijo `lo` para distinguirlos de los demás).
- Aceptan `size`, `color` y, los de un solo grosor, `strokeWidth` (la pestaña activa usa 2,4).
- **Un icono nuevo se añade a la librería**, no a la app: SVG en `src/svg/`, compilar, publicar una versión (release en GitHub) y actualizar aquí la dependencia y su excepción de `minimumReleaseAge`.

### Radios, espaciado y movimiento

- **Radios del prototipo** (`theme.radius`): `sm` 14, `md` 17, `lg` 20, `xl` 26, `xxl` 32, `xxxl` 40 y `pill`. `theme.controlHeight` (48) es el alto de campos y botones, y `touchTarget` (44) el área táctil mínima.
- **Animaciones con Reanimated,** solo con `transform` y `opacity` para que vayan en el hilo de la interfaz. Se respeta «reducir movimiento» del sistema (`useReduceMotion`). Los valores de cada animación, en un fichero aparte junto al componente (p. ej. `TabBar.animation.ts`).
- **Vibración** con `selectionFeedback()` (`shared/utils/haptics.ts`), que no falla si el móvil no vibra.

### Paneles inferiores (`BottomSheet`)

- **El panel de Lovable:** sube desde abajo (300 ms; baja en 250) sobre un velo negro al 60 % desenfocado (`expo-blur`, el `backdrop-blur-sm` del prototipo). Tarjeta `card` con las esquinas de arriba de radio `xxxl`, borde fino, barrita de agarre y la X. Ancho máximo 448 en tablets.
- **Sin `Modal`:** es una capa encima de la pantalla. Así los `Alert` y lo que venga después se ven encima, y en Android se puede desenfocar lo de debajo.
- **Desenfoque en Android:** `expo-blur` solo desenfoca lo que está dentro de un `BlurTarget`, y el panel tiene que quedar fuera. Por eso el layout monta `BlurTargetProvider` > `BlurTarget` (las pantallas) + los paneles como hermanos, encima. Con `blurMethod: "dimezisBlurViewSdk31Plus"`: en Android 12 o posterior desenfoca; en los anteriores queda solo el velo, sin coste.
- **Se cierra** con la X, tocando fuera o con el botón atrás de Android (`onClose`). Con «reducir movimiento» aparece sin deslizarse (lo respetan solas las animaciones de entrada y salida de Reanimated).
- **Hoy se montan en un layout** (`(app)/_layout.tsx`). Cuando una pantalla necesite su propio panel, habrá que sacarlo al nivel del layout con un portal.

### Reglas de siempre

- **Solo tema oscuro por ahora:** la app está fijada en `userInterfaceStyle: "dark"` y `useTheme()` devuelve siempre `darkTheme`. Cuando se defina el claro, se añade `lightTheme` con las mismas claves y `useTheme()` elige con `useColorScheme()`, sin tocar los componentes.
- **Estilos:** cada `<Comp>.styles.ts` exporta `useStyles = makeStyles((theme) => ({…}))` y el componente hace `const styles = useStyles()`.
- **Componentes base** en `shared/components/<Comp>/`: `Text`, `Button` (`primary` con el degradado de marca, `solid`, `secondary`, `link`; ignora pulsaciones mientras está ocupado), `Input` (`glass` o `solid`), `Checkbox`, `FieldError`, `PhoneInput`, `DateInput`, `GenderSelector`, `BackButton`, `BrandBackground`, `BrandLogo`, `Screen`, `LoadingState`, `ErrorState`, `EmptyState`, `BottomSheet` y `BlurTarget` (paneles inferiores) y los del menú (`AppTabs`, `TabBar`, `TabButton`, `ComingSoonScreen`).
- **Nada de `zIndex` en elementos que se desmontan** (botón de volver, splash, overlays): se colocan como último hijo y se pintan encima por orden. En Android, un hijo con `zIndex` que se desmonta durante una transición cierra la app (`IndexOutOfBoundsException` en `getChildDrawingOrder`).
- **Accesibilidad mínima:** `accessibilityLabel` en los controles, roles (`tab`, `tablist`, `checkbox`…), áreas táctiles de al menos 44 y contraste suficiente.
- **Responsive:** la app está bloqueada en vertical (`orientation: "portrait"`), pero en tablets y plegables Android 16 ignora el bloqueo. Las pantallas no dependen de un ancho fijo: `flex`, `useWindowDimensions`, `onLayout` y anchos máximos.
- **Edge-to-edge:** obligatorio en Android 16; el contenido respeta las zonas seguras con `react-native-safe-area-context`.
- **Barra de navegación de Android:** con navegación por botones, Android pinta detrás una capa translúcida (blanca con el sistema en claro). El plugin de `expo-navigation-bar` la quita (`enforceContrast: false`, `style: "dark"`: botones claros). Expo Go no aplica plugins: allí la barra sigue saliendo; se ve bien en un development build o en la de tienda.

---

## 14. Versionado (Android e iOS)

Hay **dos números**, y cada uno se gestiona de una forma. Aplican igual en Android y en iOS, y las dos plataformas salen siempre con la misma versión.

| Número | Android | iOS | Quién lo cambia |
|---|---|---|---|
| **Versión** SemVer `MAJOR.MINOR.PATCH` (la que ve el usuario) | `versionName` | `CFBundleShortVersionString` | **Manual**, siguiendo el estándar |
| **Build** (número interno de la tienda) | `versionCode` | `buildNumber` | **Automático**, lo sube EAS |

- **Build:** `eas.json` lleva `"appVersionSource": "remote"` y `autoIncrement: true` en `preview` y `production`. No se escribe `versionCode` ni `buildNumber` en `app.config.js`: con fuente remota se ignoran y solo confunden.
- **Versión:** se cambia a mano en `app.config.js` (`expo.version`) y la misma en `package.json`. La app arranca en `1.0.0`.
  - **PATCH** (`1.0.0 → 1.0.1`): solo correcciones (`fix`).
  - **MINOR** (`1.0.1 → 1.1.0`): funcionalidad nueva compatible (`feat`), como una pantalla nueva.
  - **MAJOR** (`1.1.0 → 2.0.0`): cambios incompatibles, rediseño completo o fin de soporte de versiones antiguas.
  - Con varios cambios, manda el mayor: un `feat` y tres `fix` suben MINOR.
- **OTA contra binario:**
  - Un `eas update` **no cambia la versión**: entrega JavaScript a los binarios con el mismo `runtimeVersion` (policy `fingerprint`).
  - La versión solo sube cuando se genera **un binario nuevo para la tienda**.
  - Si el cambio toca código nativo, el fingerprint cambia solo y obliga a ese binario nuevo.
- **Release a tienda:**
  1. Decidir la versión con SemVer, mirando los commits desde la última etiqueta.
  2. Cambiarla en `app.config.js` y `package.json`.
  3. Commit `chore(release): X.Y.Z` y etiqueta `vX.Y.Z`.
  4. `eas build --profile production --platform all` (EAS asigna el build de cada plataforma).
  5. `eas submit --profile production` a Play Store y App Store.
- **Previews internas** (`preview`): usan la versión actual y EAS sube solo el build.

---

## 15. Flujo de Git

- **Ramas:**
  - `master`: lo que está en tienda. Solo recibe merges desde `dev` en una release.
  - `dev`: integración, se prueba contra el servidor de dev.
  - `feature/<pantalla>` y `fix/<descripcion>`: salen de `dev` y vuelven a `dev` por PR.
- **No se hace push directo** a `master` ni a `dev`.
- **Commits:** Conventional Commits en español, con el scope de la pantalla y explicando el porqué.
  - `feat(asistencia): marcar ausente desde la lista`
  - `fix(auth): el refresh fallido por red ya no cierra la sesión`
  - Tipos: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `chore`.
- **Release:** PR `dev → master` + versión + etiqueta, según la [sección 14](#14-versionado-android-e-ios).

---

## 16. Definition of Done

Un cambio no está terminado hasta que cumple todo esto:

- [ ] Estructura respetada: todo dentro de su feature, lo compartido en `shared/<tipo>/`, sin imports entre features.
- [ ] `pnpm typecheck` (app y tests) y `pnpm lint` sin errores.
- [ ] Tests en la ruta espejo, pasando con `pnpm test`.
- [ ] Textos en los 6 idiomas; ninguno hardcodeado.
- [ ] Contrato comprobado en Scalar, o mock + petición en `docs/endpoints-pendientes/`; tabla de endpoints actualizada.
- [ ] Errores tratados como RFC 9457 y traducidos por `type`.
- [ ] Una `CachePolicy` en cada query e invalidaciones tras cada mutación.
- [ ] Probado en Android e iOS (en tema oscuro; en claro cuando exista).
- [ ] Ningún secreto ni `.env` en el diff.
- [ ] Commit con el formato de la [sección 15](#15-flujo-de-git).

---

## 17. Arranque del repo: de cero, trayendo solo lo necesario

La app **no es una copia de la appStudent**. Parte de un proyecto Expo en blanco (plantilla `blank-typescript`, SDK 57) con la estructura de la [sección 2](#2-estructura-de-carpetas), y de la appStudent se trae **solo lo que hace falta, pieza a pieza**, ya colocado en su sitio y adaptado a profesor. Nada se trae "por si acaso".

### Pasos

1. Proyecto Expo en blanco con TypeScript, `expo-router` con las rutas en `src/app/` y las carpetas vacías de `src/features/` y `src/shared/<tipo>/`.
2. `package.json`: `name`, `version: "1.0.0"` y `packageManager` con la versión de pnpm 11 del equipo. `pnpm install` genera el lock.
3. Identidad en `app.config.js`: `name` (`Playtopia Pro` / `Playtopia Pro DEV`), `slug`, `scheme`, `bundleIdentifier` y `package` (con sufijo `.dev` en desarrollo), iconos, splash, textos de permisos y `version: "1.0.0"`.
4. `.gitignore`, `.env.example` con las variables de la [sección 5](#5-secretos-y-variables-de-entorno), alias `@/`, Jest con el espejo `__tests__/` y ESLint.
5. `shared/` base, trayendo cada pieza cuando se necesita (ver mapa).
6. Pantallas base, una feature cada una, con sus tests.
7. `eas init` para un proyecto EAS nuevo, con los perfiles development, preview, production y production-apk y sus canales. Firebase y Sentry nuevos, con credenciales por variables de EAS.

### Piezas de la raíz que se traen

- `.gitattributes`: en este repo git no convierte finales de línea; el fingerprint de `runtimeVersion` depende de ello.
- `scripts/verificar-antes-de-publicar.mjs` y `scripts/only-pnpm.js`, cuando se configure la publicación y pnpm.

### Mapa: de dónde sale cada pieza que se trae

Cada fila se trae **solo cuando una pantalla la necesita**, revisada y adaptada, no copiada a ciegas. La appStudent está en el SDK 54 y esta app en el 57: al traer una pieza, se revisan en la documentación del SDK 57 las APIs de Expo que usa.

| appStudent | app Profesor |
|---|---|
| `services/client/*`, `services/storage/tokenStorage.ts`, `types/errors.ts` (HttpError) | `shared/services/` |
| Forma del `ProblemDetail` | `shared/schemas/problemDetail.schema.ts` |
| `config/queryClient.ts`, `config/sentry`, `utils/i18n.ts`, `theme/` | `shared/config/` |
| `utils/logger.ts`, `dayjs.ts`, `serverClock.ts`, `translateError.ts`, `imageCache.ts` | `shared/utils/` |
| `locales/*` | `shared/locales/`, sin las claves de pantallas de alumno |
| `components/shared/*` (ErrorState, LoadingState, FeatureScreen…), navbar, back button | `shared/components/` |
| `useNetworkStatus`, `useAppUpdates`, `useVersionCheck`, `useSystemUI`… | `shared/hooks/` |
| `store/credential/tempCredentialsStore.ts` | `shared/store/` |
| `services/auth`, `schemas/auth`, `hooks/queries/useAuthQueries.ts`, `features/sign-in`, `features/biometric-auth`, endpoints y query keys de auth | `features/auth/` |
| `features/register`, `utils/registrationToken.ts`, `config/security` (adaptados a profesor) | `features/auth/` (la firma en `services/`, la variable en `shared/config/env.ts`) |
| `features/password-recovery`, `services/PasswordRecovery`, `schemas/password-recovery` | `features/auth/` (con `scope: "teacher"`) |
| `services/notification/installationId.ts`, `notificationService.ts` | `features/notifications/services/` (o `shared/services/` si lo usa también el login) |
| Pantallas de alumno (pagos, inscripciones, clubes, recuperaciones…) | **no se traen** |

---

## 18. Receta: crear una pantalla nueva

1. Rama `feature/<pantalla>` desde `dev`.
2. Buscar en Scalar los endpoints que necesita. Si falta alguno: contrato propio + mock + petición (ver [sección 4](#si-el-endpoint-no-existe-o-no-devuelve-lo-necesario-mock--petición-a-core)).
3. Crear `src/features/<pantalla>/`:
   1. `schemas/`: contrato Zod y tipos con `z.infer`.
   2. `services/`: endpoints, query keys (con `db_id` + `club_id` si son datos de club) e implementación del service.
   3. `hooks/`: queries y mutaciones, cada query con su `CachePolicy`.
   4. `components/`: `<Comp>/<Comp>.tsx`, `<Comp>.styles.ts`, `index.ts`.
   5. `<X>Screen.tsx`: compone hooks y componentes.
   6. `index.ts`: exporta la pantalla y lo que otras partes necesiten.
4. Ruta en `src/app/` que monta `<X>Screen`.
5. Textos en los 6 idiomas.
6. Tests en la ruta espejo de `__tests__/`.
7. Actualizar la tabla de Endpoints en uso.
8. Repasar la [Definition of Done](#16-definition-of-done) y abrir PR a `dev`.

Si algo pasa a usarse en una segunda pantalla, se mueve a `shared/<su tipo>/` y su test a `__tests__/shared/<su tipo>/`.

---

## 19. Publicación

**R8 (Android):** `expo-build-properties` activa `enableMinifyInReleaseBuilds` y `enableShrinkResourcesInReleaseBuilds`. Solo afecta a los builds de release: ofusca y elimina código y recursos sin usar, que es lo que Google Play mide como "optimización de código DEX" (por debajo del 25 % en ofuscación limita la visibilidad de la app). Cada librería nativa nueva se valida en el siguiente build de release; si R8 la rompe, sus reglas van en `android.extraProguardRules`. El `mapping.txt` se sube a Play y a Sentry cuando se configuren.

| Comando | Para qué |
|---|---|
| `pnpm start` | desarrollo contra el servidor de dev |
| `eas build --profile development` | dev client interno |
| `eas build --profile preview` | build interno de pruebas (EAS sube el build) |
| `eas build --profile production --platform all` | release a tienda (ver [sección 14](#14-versionado-android-e-ios)) |
| `pnpm verificar:ota` | **obligatorio** antes de cualquier OTA: comprueba que el bundle apunta al entorno correcto y que el update llega a binarios que pueden ejecutarlo |
| `pnpm eas:update:preview` / `pnpm eas:update:production` | OTA por canal |
