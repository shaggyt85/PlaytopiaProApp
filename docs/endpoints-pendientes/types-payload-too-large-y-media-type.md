# Types RFC 9457 para el tamaño y el formato del cuerpo

- **Estado:** **en desarrollo** (hecho en el Core local el 2026-09-28, fase E3.1; falta desplegar a dev).
- **Qué cambia en Core:** dos `type` genéricos nuevos, uno por status, como `not-found` o `invalid-request`. Hasta ahora los dos casos salían como 400 `invalid-request`.

  | `type` | Status | Cuándo sale | `detail` |
  |---|---|---|---|
  | `urn:playtopia:problem:payload-too-large` | 413 | un fichero subido supera su tope (avatar 5 MB, imágenes 20 MB, PDF 5 MB) o un cuerpo JSON supera el límite global | «Archivo demasiado grande: máximo 5MB» / «El cuerpo de la petición supera el tamaño máximo» |
  | `urn:playtopia:problem:unsupported-media-type` | 415 | un cuerpo JSON llega sin `Content-Type: application/json` | «Falta la cabecera Content-Type: application/json» |

- **Pantalla que lo necesita:** la subida del avatar del profesor (`POST /api/MobileTeacher/UploadMobileTeacherAvatar`), cuando la app la tenga. El tope es `max_avatar_upload_mb` (5 MB).
- **En la app:**
  - `payload-too-large`: la pantalla puede decir «La imagen pesa demasiado» en vez del texto genérico de un 400. Conviene comprimir antes de subir, como hace la app de alumnos, para no llegar nunca a él.
  - `unsupported-media-type`: no debería verse nunca; lo evita el cliente HTTP poniendo siempre el `Content-Type`. Si aparece, es un fallo de la app, no del usuario.
- **Cuando Core lo publique:** añadir las dos claves a `errors.byType` en los 6 idiomas (`src/shared/locales/`).
