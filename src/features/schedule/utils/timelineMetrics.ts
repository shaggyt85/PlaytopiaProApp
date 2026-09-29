// Las medidas de la vista Día del prototipo (`DayView` de `calendar.tsx`). Las
// comparten la tira, su rejilla de horas y las tarjetas.

/** Alto de una hora (`hourPx = 64`). */
export const HOUR_HEIGHT = 64;
/** Columna de las horas (`w-10`). */
export const HOUR_LABEL_WIDTH = 40;
/** Alto mínimo de una tarjeta, para que una clase corta se lea (`Math.max(40, …)`). */
export const BLOCK_MIN_HEIGHT = 40;
/** Desde este alto la tarjeta enseña también el club y las plazas (`height > 60`). */
export const BLOCK_DETAIL_MIN_HEIGHT = 60;
