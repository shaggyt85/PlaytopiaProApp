# Types RFC 9457 para el alta de profesor

- **Estado:**
  - `email-already-registered`: **en desarrollo** (hecho en el Core local el 2026-09-27, fase C1.5; falta commit y desplegar a dev). Los tres registros (cliente, alumno y profesor) devuelven ahora `DomainError::EmailAlreadyRegistered`, que sale como 409 con este `type`; también el alta de profesor desde el CRM.
  - `registration-token-expired` y `registration-token-invalid`: pendiente.
- **Pantalla que lo necesita y para qué:** registro (`SignUpScreen`, `POST /api/UserTeacher`). La app traduce los errores por `type` y nunca muestra el `detail` (guía §5). Hoy los errores del alta llegan todos con `type: "about:blank"`, así que la app solo puede enseñar el texto genérico de su status.
- **Situación actual (comprobada en Core, `dev`, 26-sep-2026):**

  | Caso | Dónde nace | Status | `type` hoy | `detail` hoy |
  |---|---|---|---|---|
  | El email ya tiene cuenta de profesor | `teacher_repo::create`, violación de la restricción única de `user_teachers` → `DomainError::Conflict` | 409 | `about:blank` | «El email ya está registrado» |
  | `registration_token` caducado (fuera de `token_skew_secs`) | `validate_registration_token` → `DomainError::Validation` | 400 | `about:blank` | «registration_token expirado» |
  | `registration_token` con formato, timestamp o hash inválido | ídem | 400 | `about:blank` | «registration_token inválido» / «…: timestamp inválido» / «…: hash inválido» |
  | `registration_token` con firma que no coincide | ídem | 400 | `about:blank` | «registration_token: firma inválida» |

  Solo choca con otro profesor: un email que ya es de alumno puede darse de alta como profesor, porque son cuentas separadas.

- **Propuesta:** tres `ProblemType` nuevos, cada uno con su variante, su URI y su mapeo, como `CatalogSlugTaken`:

  | `type` | Status | Caso | Qué hace la app |
  |---|---|---|---|
  | `urn:playtopia:problem:email-already-registered` | 409 | el email ya tiene cuenta de profesor | lo pinta en el campo email («Este email ya tiene cuenta de profesor. Inicia sesión.») |
  | `urn:playtopia:problem:registration-token-expired` | 400 | token fuera de la tolerancia de hora | reintenta una vez firmando de nuevo (la respuesta ya calibró la hora del servidor) |
  | `urn:playtopia:problem:registration-token-invalid` | 400 | formato, hash o firma incorrectos | mensaje genérico; no se reintenta (es el secreto o una app manipulada) |

  El `detail` puede seguir igual: es para logs y Scalar.

- **Rol:** público (el endpoint no lleva JWT; lo protege el `registration_token`).
- **Tag de Scalar:** el del endpoint (Users → Teachers).
- **Respuesta de ejemplo (409):**

  ```json
  {
    "type": "urn:playtopia:problem:email-already-registered",
    "title": "Conflict",
    "status": 409,
    "detail": "El email ya está registrado",
    "instance": "/api/UserTeacher"
  }
  ```

- **Reglas:** mismo status que hoy, para no romper a nadie: solo cambia el `type`. `POST /api/UserStudent` usa `validate_registration_token` y el mismo patrón de alta, así que la app de alumnos se beneficiaría igual si se aplica en los dos.
- **En la app mientras tanto:** el 409 se muestra con el texto genérico del status (`errors.byStatus.409`) y el 400 con el suyo. No hay reintento por token caducado: para llegar al registro el profesor pasa antes por `check-email`, cuya respuesta ya calibra la hora del servidor (`serverClock`), así que el token nace con la hora de Core.
- **Cuando Core lo publique:** añadir las tres claves a `errors.byType` en los 6 idiomas (`src/shared/locales/`); para el 409, pintar el error en el campo email; para `registration-token-expired`, reintentar una vez en `signUpService`.
