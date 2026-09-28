# Type RFC 9457 para un campo obligatorio que falta

- **Estado:** **en desarrollo** (hecho en el Core local el 2026-09-28, fase E3.2; falta desplegar a dev).
- **Qué cambia en Core:** un `type` genérico nuevo, `urn:playtopia:problem:missing-field` (400). Hasta ahora un campo que faltaba salía como 400 `invalid-request`, igual que un formulario roto o un JSON mal escrito.

  | Caso | Status | `type` | `detail` |
  |---|---|---|---|
  | Falta un campo obligatorio | 400 | `missing-field` | «Falta el campo «avatarFile»» |
  | Faltan varios | 400 | `missing-field` | «Faltan los campos «name», «email»» |
  | El formulario llega roto | 400 | `invalid-request` | «No se pudo leer el formulario» |

  El nombre del campo va en el `detail`, con el nombre que manda el cliente. No va como extension member.

- **Dónde sale ya:** en las subidas multipart. La que afecta a la app es la subida del avatar del profesor (`POST /api/MobileTeacher/UploadMobileTeacherAvatar`, campo `avatarFile`), cuando la app la tenga.
- **Dónde saldrá después (fase E3.6 de Core):** el resto de endpoints, incluidos los cuerpos JSON. Hasta entonces, un campo que falta en un JSON sigue saliendo como `invalid-request`.
- **En la app:** la app ya valida sus formularios antes de enviarlos, así que en la práctica no debería verse. Si aparece, es un fallo de la app (un campo que no se envía), no del usuario: basta el texto genérico traducido.
- **Cuando Core lo publique:** añadir la clave a `errors.byType` en los 6 idiomas (`src/shared/locales/`).
