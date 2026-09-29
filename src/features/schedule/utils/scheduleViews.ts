import type { t as translate } from "@/shared/config/i18n";
import type { TranslationKey } from "@/shared/locales";
import { formatMonthYear, formatWeekdayDay } from "@/shared/utils/formatDate";

import { dayLabel } from "./dayLabel";
import { addDays, addMonths, DAYS_PER_WEEK } from "./scheduleDates";
import { dayToolbarLabel, monthToolbarLabel, weekRange, weekToolbarLabel } from "./toolbarLabel";

interface ScheduleViewItem {
  key: string;
  label: TranslationKey;
}

/**
 * Las vistas de la agenda, en el orden del selector (DÍA · SEMANA · MES). La
 * primera es la que se ve al abrir la pantalla.
 */
export const SCHEDULE_VIEWS = [
  { key: "day", label: "schedule.views.day" },
  { key: "week", label: "schedule.views.week" },
  { key: "month", label: "schedule.views.month" },
] as const satisfies readonly ScheduleViewItem[];

export type ScheduleView = (typeof SCHEDULE_VIEWS)[number]["key"];

type Translate = typeof translate;

/** Todo lo que cambia con cada vista, junto. */
interface ScheduleViewConfig {
  /** A dónde lleva la flecha `direction` (› 1, ‹ -1). */
  step: (date: string, direction: 1 | -1) => string;
  /** El texto de la barra. */
  toolbar: (date: string, nowWall: number, t: Translate) => string;
  /** Lo que dice el lector de pantalla al cambiar de día, semana o mes (sin la hora). */
  announce: (date: string, isToday: boolean, t: Translate) => string;
  /** Lo que dicen las flechas al lector de pantalla. */
  previous: TranslationKey;
  next: TranslationKey;
}

/**
 * La ficha de cada vista: un solo sitio. Una vista nueva se añade aquí y
 * `satisfies` obliga a darle todos sus campos, o no compila.
 *
 * - Día: un día por flecha; «lunes 18 · 21:41».
 * - Semana: siete; «16 nov – 22 nov · 21:41».
 * - Mes: un mes, con el mismo número de día o el último (31 → 30); «noviembre
 *   de 2026».
 */
export const SCHEDULE_VIEW_CONFIG = {
  day: {
    step: (date, direction) => addDays(date, direction),
    toolbar: dayToolbarLabel,
    announce: (date, isToday, t) => dayLabel(formatWeekdayDay(date), isToday, t),
    previous: "schedule.day.previousDay",
    next: "schedule.day.nextDay",
  },
  week: {
    step: (date, direction) => addDays(date, direction * DAYS_PER_WEEK),
    toolbar: weekToolbarLabel,
    announce: (date, _isToday, t) => weekRange(date, t),
    previous: "schedule.week.previous",
    next: "schedule.week.next",
  },
  month: {
    step: (date, direction) => addMonths(date, direction),
    toolbar: monthToolbarLabel,
    announce: (date) => formatMonthYear(date),
    previous: "schedule.month.previous",
    next: "schedule.month.next",
  },
} satisfies Record<ScheduleView, ScheduleViewConfig>;

/** La fecha a la que lleva la flecha `direction` en la vista `view`. */
export const stepDate = (date: string, view: ScheduleView, direction: 1 | -1): string =>
  SCHEDULE_VIEW_CONFIG[view].step(date, direction);

/** El texto de la barra para el día `date` en la vista `view`. */
export const toolbarLabel = (view: ScheduleView, date: string, nowWall: number, t: Translate): string =>
  SCHEDULE_VIEW_CONFIG[view].toolbar(date, nowWall, t);

/** Lo que se anuncia al llegar a `date` en la vista `view`. */
export const announceLabel = (view: ScheduleView, date: string, isToday: boolean, t: Translate): string =>
  SCHEDULE_VIEW_CONFIG[view].announce(date, isToday, t);
