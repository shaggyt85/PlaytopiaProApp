# Type RFC 9457 para un método que la ruta no admite

- **Estado:** **en desarrollo** (hecho en el Core local el 2026-09-28, fase E3.3c; falta desplegar a dev).
- **Qué cambia en Core:** un `type` genérico nuevo, `urn:playtopia:problem:method-not-allowed` (405). Hasta ahora un método que la ruta no admitía —un `DELETE` a una ruta que solo es `GET`— devolvía un 405 con el cuerpo vacío, sin `ProblemDetail`.

  | Caso | Status | `type` | `detail` | Cabecera |
  |---|---|---|---|---|
  | La ruta existe pero no con ese método | 405 | `method-not-allowed` | «El método DELETE no está permitido en /api/School» | `Allow` con los métodos que sí admite |

- **En la app:** no debería verse nunca. Si aparece, es un fallo de la app (un servicio que llama con el método equivocado), no del usuario: basta el texto genérico traducido.
- **Cuando Core lo publique:** añadir la clave a `errors.byType` en los 6 idiomas (`src/shared/locales/`).
