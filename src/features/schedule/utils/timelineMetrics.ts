/** Opacidad de una clase que ya terminó (`opacity-50`), la misma en Día, Semana y Mes. */
export const PAST_OPACITY = 0.5;

// Las medidas de la vista Día del prototipo (`DayView` de `calendar.tsx`). Las
// comparten la tira, su eje de horas y las tarjetas.

/** Alto de una hora (`hourPx = 80`). */
export const HOUR_HEIGHT = 80;
/** Columna de las horas, alineadas a la derecha (`width: 44`). */
export const HOUR_LABEL_WIDTH = 44;
/** Dónde va la línea vertical de las horas, desde la izquierda (`LINE = 52`). */
export const TIMELINE_LINE_X = 52;
/** Dónde empiezan las tarjetas, a la derecha de la línea (`left: 3.75rem`). */
export const BLOCKS_LEFT = 60;
/** Alto mínimo de una tarjeta, para que una clase corta se lea (`Math.max(40, …)`). */
export const BLOCK_MIN_HEIGHT = 40;
/** Desde este alto la tarjeta enseña también el club y las plazas (`height > 60`). */
export const BLOCK_DETAIL_MIN_HEIGHT = 60;
