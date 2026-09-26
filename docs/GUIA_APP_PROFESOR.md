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
8. [Sesión, almacenamiento y multi-club](#8-sesión-almacenamiento-y-multi-club)
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
| Navegación | expo-router 6 |
| Datos de servidor | TanStack Query 5 + axios |
| Contratos y validación | Zod 4 |
| Estado de UI | Zustand 5 |
| Formularios | react-hook-form + `@hookform/resolvers` (zodResolver) |
| i18n | i18n-js (es, en, pt, ca, de, fr) |
| Fechas | dayjs (utc, timezone) |
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
- `minimumReleaseAge` (política de cadena de suministro de pnpm 11, activa por defecto): pnpm no instala versiones publicadas hace muy poco, que es cuando una versión maliciosa todavía no se ha detectado. **No se añaden excepciones** (`minimumReleaseAgeExclude`): si una versión es demasiado reciente, se usa la anterior. Si pnpm añade una excepción por su cuenta, se quita y se reinstala. Los ajustes de pnpm 11 van en `pnpm-workspace.yaml` (ya no se leen de `.npmrc`): `nodeLinker: hoisted`, para que `node_modules` quede en plano como espera el autolinking nativo, y `allowBuilds`, donde se aprueba (`true`) o se deniega (`false`) cada dependencia con script de instalación. Una dependencia nueva con script para la instalación hasta que se decide.

---

## 2. Estructura de carpetas

**Una feature = una pantalla de la app.** Dentro lleva todo lo que esa pantalla necesita. Lo que usan dos o más features va en `shared/`, y nunca como archivo suelto: va en la carpeta de su tipo, igual que dentro de una feature.

```
src/
  app/                   rutas expo-router, solo montan la pantalla
    _layout.tsx
    (auth)/              sign-in, sign-up, password-recovery
    (app)/               pantallas con sesión (guard en su _layout)
  features/
    sign-in/             = pantalla Login
      components/
      hooks/
      services/
      schemas/
      SignInScreen.tsx
      index.ts
    home/                = pantalla Home
      components/
      hooks/
      services/
      schemas/
      store/             solo si la pantalla tiene estado de UI propio (Zustand)
      HomeScreen.tsx
      index.ts
    ...                  una carpeta por pantalla
  shared/                lo usado por 2 o más features, por tipo
    components/          Button, ErrorState, LoadingState, Navbar…
    hooks/               useNetworkStatus, useAppUpdates…
    services/            httpClient, tokenStorage
    schemas/             schemas comunes (ProblemDetail…)
    store/               sesión y club activo (Zustand)
    locales/             diccionario compartido: es, en, pt, ca, de, fr
    config/              env, queryClient, cachePolicies, i18n, theme, sentry
    utils/               logger, fechas, formato, serverClock, imageCache
__tests__/               espejo de src/
  features/
    sign-in/
      hooks/useLogin.test.ts
      services/authService.test.ts
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

1. **Una feature por pantalla.** Dentro van sus `components/`, `hooks/`, `services/` (con sus endpoints y query keys), `schemas/`, `store/` si hace falta, `<X>Screen.tsx` e `index.ts`.
2. **No hay carpetas por tipo en la raíz de `src/`** (`src/services/`, `src/hooks/`…). O algo es de una feature, o está en `shared/<tipo>/`.
3. **`shared/` solo recibe lo que usan dos o más features**, y siempre en la carpeta de su tipo: un componente compartido va a `shared/components/`, un hook a `shared/hooks/`, un service a `shared/services/`, un schema a `shared/schemas/`. No hay archivos sueltos en `shared/`. Mientras algo lo use una sola feature, se queda en ella.
4. **`shared/` nunca importa de `features/`**, y una feature no importa de otra feature.
5. **`app/` solo contiene rutas**: importa `<X>Screen` desde el `index.ts` de la feature. Sin lógica.
6. **Nombres**: carpetas de feature en kebab-case, componentes y pantallas en PascalCase, hooks `useX`, siempre `index.ts`.
7. **Un solo alias**: `@/` apunta a `src/`.
8. **Estado**:
   - Lo que viene del servidor vive **solo** en TanStack Query. Nunca se copia a Zustand.
   - Zustand es para estado de UI (filtros, modo edición, pestaña activa). Va en `features/<x>/store/` si lo usa una pantalla y en `shared/store/` si lo usan varias. La sesión y el club activo van en `shared/store/`.
   - Un store por responsabilidad, con selectores (`useStore((s) => s.campo)`) para no re-renderizar de más.
   - Solo se persiste con AsyncStorage (`persist` + `createJSONStorage`) lo no sensible que tiene que sobrevivir a reiniciar la app. Los tokens van en SecureStore (ver [sección 8](#8-sesión-almacenamiento-y-multi-club)).

### Tests: espejo de `src/`

A `src/features/sign-in/hooks/useLogin.ts` le corresponde `__tests__/features/sign-in/hooks/useLogin.test.ts`. Si se mueve o renombra un archivo, su test se mueve igual. Solo `helpers/` y `setup/` quedan fuera del espejo.

Configuración de Jest: `testMatch` apunta a `__tests__/**/*.test.(ts|tsx)` y `moduleNameMapper` traduce `^@/(.*)$` a `<rootDir>/src/$1`.

### Pantallas iniciales

Base común que se trae de la appStudent, adaptada a profesor:

| Feature | Qué hace |
|---|---|
| `sign-in` | login contra `/api/auth/login/teacher`, biometría |
| `sign-up` | alta contra `POST /api/UserTeacher`, con firma HMAC |
| `password-recovery` | recuperación con `scope: "teacher"` |
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
| POST | `/api/auth/login/teacher` | sign-in | real |
| POST | `/api/auth/refresh` | shared (httpClient) | real |
| POST | `/api/auth/check-email` | sign-up | real |
| POST | `/api/UserTeacher` | sign-up | real |
| POST | `/api/PassRecovery/request` (con `scope: "teacher"`) | password-recovery | real |
| POST | `/api/PassRecovery/validate` | password-recovery | real |
| GET | `/api/UserTeacher/{id}` | profile | real |
| PATCH | `/api/UserTeacher/{id}` | profile | real |
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
- Una variable que solo necesita una pantalla futura se declara opcional y pasa a obligatoria cuando esa pantalla existe (el secreto HMAC, con `sign-up`).
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

- El secreto entra **solo por env** (`EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET`, con el mismo valor que valida Core, más `EXPO_PUBLIC_TOKEN_SKEW_SECONDS`, por defecto 300). Su valor vive en las variables de EAS y en el `.env` local, **nunca en el repo**.
- Es una **firma de origen** para frenar altas automáticas, no un secreto fuerte: al ser `EXPO_PUBLIC_*`, va dentro del bundle. Si se filtra, se rota en Core y en EAS a la vez.
- El timestamp sale de `serverClock` para no fallar por la desviación del reloj del móvil.

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

## 8. Sesión, almacenamiento y multi-club

### Login

- `POST /api/auth/login/teacher` (role_id = 4). Devuelve `access_token`, `refresh_token`, `id`, `role_id` y `db_id`.
- Los tokens se guardan en **SecureStore** mediante `shared/services/tokenStorage`.
- **Refresh:** lo hace `BaseHttpClient`. Ante un 401 llama una sola vez a `/api/auth/refresh` y reintenta la request original. La promesa de refresh es compartida: el refresh token es de un solo uso y Core lo rota, así que varios 401 a la vez no pueden disparar varios refresh.
  - Refresh rechazado → se cierra la sesión.
  - Fallo de red durante el refresh → **no** se saca al usuario al login.

### Registro

- `sign-up` llama a `POST /api/UserTeacher`. Campos obligatorios: `name`, `last_name`, `email`, `password`, `phone_number`, `birthday`, `document_id` y `registration_token`; opcionales `address` y `gender`.
- Se puede usar antes `POST /api/auth/check-email` para avisar de un email ya registrado.
- Si responde 201, llegan `access_token` y `refresh_token`: se guardan igual que en el login y el profesor entra directamente. Se ofrece activar la biometría.
- Errores 400 y 409 (email ya registrado) se muestran en el formulario por `type`.

### Recuperación de contraseña

- `POST /api/PassRecovery/request` con **`scope: "teacher"`**. Sin `scope`, si el mismo email existe como admin o alumno, Core recupera esa otra cuenta (prioridad admin > alumno > profesor).
- Siempre responde 200, exista o no el email (anti-enumeración): la pantalla muestra el mismo mensaje en ambos casos.
- `POST /api/PassRecovery/validate` fija la contraseña nueva con el token del email; 400 si el token no existe, expiró o ya se usó.

### Almacenamiento en el dispositivo

| Mecanismo | Qué guarda | Dónde vive el código |
|---|---|---|
| **SecureStore** (Keychain / Keystore, cifrado por el sistema) | `access_token`, `refresh_token`; credenciales de biometría (email + refresh token) y el flag `biometric_enabled` | `shared/services/tokenStorage`, `features/sign-in/services/biometricService` |
| **AsyncStorage** (texto plano) | solo datos **no sensibles**: perfil público mínimo (`user_public`), idioma elegido, preferencias de notificaciones (Zustand `persist`), ID de instalación para push, onboarding visto, club activo | el service o store de cada caso |
| **Zustand en memoria** (sin persistir) | credenciales temporales tras el login (email + refresh token, caducan a los **60 s**) para activar la biometría sin volver a pedir la contraseña | `shared/store/` |
| **FileSystem** (`expo-file-system`) | caché de imágenes (avatares) en un directorio propio, con limpieza | `shared/utils/imageCache` |

**Regla:** si quien lo tenga puede actuar como el usuario, va en SecureStore. Todo lo demás, en AsyncStorage. **La contraseña no se guarda en ningún sitio.**

### Biometría (Face ID / Touch ID / huella)

- `expo-local-authentication`, opcional. Se ofrece justo después del primer login o registro correcto, usando las credenciales temporales de 60 s.
- Al activarla, el email y el refresh token se guardan en SecureStore.
- En el siguiente arranque, la biometría desbloquea esas credenciales y se hace refresh para obtener un `access_token` nuevo, sin pedir contraseña.
- Core rota el refresh token en cada `/auth/refresh`: tras cada refresh correcto **se actualiza también el refresh token guardado para biometría** (`updateRefreshToken`). Si no, la biometría deja de funcionar en la sesión siguiente.
- Permisos: `NSFaceIDUsageDescription` en iOS, `USE_BIOMETRIC` en Android.

### Guards de navegación

- `app/(app)/_layout.tsx` redirige a `(auth)` si no hay sesión válida; `app/(auth)/_layout.tsx` hace lo contrario.
- Se comprueba además que `role_id` sea 4. Un token de otro rol se trata como sesión inválida.

### Logout

Borra los tokens, hace `queryClient.clear()`, resetea los stores de `shared/store/`, borra el perfil público de AsyncStorage y da de baja el token push. Las credenciales de biometría se conservan o se borran según elija el usuario.

### Multi-club

- En Core, la identidad de una sede son **`db_id` + `club_id` juntos**: `club_id` no es único entre escuelas.
- Si un profesor trabaja en varios clubes, la app mantiene un **club activo** en `shared/store/` (persistido, para que al abrir la app siga el último elegido) y un selector para cambiarlo.
- **Todas las query keys de datos de club incluyen `db_id` y `club_id`**, así los datos de dos clubes nunca se mezclan en caché. Al cambiar de club no hace falta borrar la caché: las keys ya son otras.
- La lista de clubes del profesor está **pendiente** en Core: se hace con mock + petición.

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

- Todo lo común vive en `__tests__/helpers/`: `renderWithProviders` (QueryClient, tema, i18n), factories de datos y fixtures (los mismos JSON que los mocks de endpoints).
- Cada bug corregido lleva el test que lo reproduce.
- Los tests nunca llaman al servidor real.

---

## 11. Fechas y zona horaria

- `dayjs` se configura una sola vez en `shared/config/` (plugins utc, timezone y locale).
- Las fechas de Core llegan en ISO/UTC y se muestran en la **zona horaria del club**, no en la del móvil: un profesor de viaje ve la clase a su hora real.
- La hora "ahora" (por ejemplo, para saber si una clase ya empezó) sale de `serverClock`, no del reloj del móvil.
- El formato de fecha sigue el idioma activo; nunca un locale fijo.

---

## 12. i18n

- Todo texto visible sale de `shared/locales/`. **Los 6 idiomas son obligatorios** (es, en, pt, ca, de, fr): una clave que no está en los 6 no se mergea.
- Claves agrupadas por pantalla: `signIn.title`, `home.emptyState`. Textos comunes en `common.*`; errores en `errors.byType.*` y `errors.byStatus.*` (ver [sección 6](#6-manejo-de-errores-rfc-9457)). Un `type` nuevo de Core se traduce añadiéndolo a `errors.byType` en los 6 idiomas.
- En componentes se usa el hook `useTranslation()`, que vuelve a pintar al cambiar de idioma; el `t` suelto solo fuera de React. Las claves están tipadas: una clave que no existe no compila.
- Solo se carga en memoria el diccionario del idioma activo (los 6 van en el bundle). El idioma elegido a mano se guarda en AsyncStorage (solo el código, p. ej. `"es"`) y se aplica antes de pintar la app; si no hay ninguno, se usa el del móvil y, si no está soportado, inglés.
- Nada de concatenar frases: se interpola con parámetros (`t("home.classesToday", { count })`), con plurales cuando haga falta.

---

## 13. Tema y diseño

- **Tokens en `shared/config/theme`:** colores, espaciado, radios, tipografía y sombras. En los componentes no se escriben colores ni tamaños a mano.
- Modo **claro y oscuro** desde el primer día, siguiendo el tema del sistema.
- Los componentes base (`Button`, `Card`, `Input`, `Text`, estados de carga, vacío y error) viven en `shared/components/`; las pantallas los componen.
- Estilos en `<Comp>.styles.ts` junto al componente, generados a partir del tema.
- Accesibilidad mínima: `accessibilityLabel` en los controles, áreas táctiles de al menos 44 px y contraste suficiente en los dos temas.
- **Responsive:** la app está bloqueada en vertical (`orientation: "portrait"`), pero en tablets y plegables Android 16 (targetSdk 36) ignora el bloqueo. Las pantallas no dependen de un ancho fijo: `flex`, `useWindowDimensions` y anchos máximos para que en pantalla grande o en horizontal no se rompan.
- **Edge-to-edge:** en Android 16 es obligatorio; el contenido respeta las zonas seguras con `react-native-safe-area-context`. No se usan las APIs antiguas de color o translucidez de la barra de estado.

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
  - `fix(sign-in): el refresh fallido por red ya no cierra la sesión`
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
- [ ] Probado en Android e iOS, en tema claro y oscuro.
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
| `services/auth`, `schemas/auth`, `hooks/queries/useAuthQueries.ts`, `features/sign-in`, `features/biometric-auth`, endpoints y query keys de auth | `features/sign-in/` |
| `features/register`, `utils/registrationToken.ts`, `config/security` (adaptados a profesor) | `features/sign-up/` (la firma en `services/`, la variable en `shared/config/env.ts`) |
| `features/password-recovery`, `services/PasswordRecovery`, `schemas/password-recovery` | `features/password-recovery/` (con `scope: "teacher"`) |
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
