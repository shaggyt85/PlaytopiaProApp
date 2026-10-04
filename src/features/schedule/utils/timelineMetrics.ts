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
/**
 * Alto mínimo del hueco de una tarjeta: 86 de tarjeta (`Math.max(86, …)`, todo su
 * contenido cabe siempre, también en una clase corta) y 8 de separación con la
 * de debajo, que el prototipo deja aparte.
 */
export const BLOCK_MIN_HEIGHT = 94;
