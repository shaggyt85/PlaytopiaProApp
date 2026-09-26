# Zona horaria del club para la app del profesor

- **Estado:** pendiente
- **Pantalla que lo necesita y para qué:** todas las que muestran horarios (clases del día, calendario, asistencia). La app necesita la zona IANA del club para:
  - saber si una clase ya empezó (`class_date` + `class_time` son hora de pared del club);
  - mostrar en la hora del club los instantes que llegan en UTC (`created_at`, `payment_date`, timestamps);
  - saber qué día es "hoy" para el club, igual que `club_today` en Core.
- **Situación actual:** Core resuelve la zona por tenant (`TenantTimezoneResolver::timezone_for(db_id)`), pero ningún endpoint `Mobile` la devuelve; solo `CutDateResponse` del CRM. La app usa `Europe/Madrid` (el `DEFAULT_TIMEZONE` de Core) mientras tanto.
- **Propuesta:** añadir `timezone` (identificador IANA, p. ej. `"Europe/Madrid"`) a la respuesta que devuelve los clubes del profesor (ver la petición de clubes del profesor cuando exista) o, si se prefiere, a la respuesta del perfil del profesor. Como la zona es por tenant, un campo por `db_id` basta.
- **Rol:** JWT de profesor (role_id = 4).
- **Tag de Scalar sugerido:** Mobile.
- **Respuesta (fragmento):**

  ```json
  {
    "db_id": 3,
    "club_id": 12,
    "name": "Club Pádel Centro",
    "timezone": "Europe/Madrid"
  }
  ```

- **Errores:** los del endpoint que lo incluya; la zona nunca falla (Core ya cae en `DEFAULT_TIMEZONE`).
- **Reglas:** mismo valor que usa Core en `club_clock.rs` para ese tenant, para que la app y el servidor calculen igual "hoy" y "ya empezó".
- **En la app:** `src/shared/utils/clubClock.ts` ya recibe la zona como parámetro; solo hay que pasarle la del club activo en lugar de `DEFAULT_CLUB_TIMEZONE`.
