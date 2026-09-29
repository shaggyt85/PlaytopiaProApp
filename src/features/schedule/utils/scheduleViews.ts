import type { TranslationKey } from "@/shared/locales";

interface ScheduleViewItem {
  key: string;
  label: TranslationKey;
}

/**
 * Las vistas de la agenda, en el orden del selector (DÍA · SEMANA · MES). La
 * primera es la que se ve al abrir la pantalla. Lo que cambia con cada vista (a
 * dónde llevan las flechas, el texto de la barra) va en mapas por vista con
 * `satisfies Record<ScheduleView, …>`: una vista nueva sin su entrada no compila.
 */
export const SCHEDULE_VIEWS = [
  { key: "day", label: "schedule.views.day" },
  { key: "week", label: "schedule.views.week" },
  { key: "month", label: "schedule.views.month" },
] as const satisfies readonly ScheduleViewItem[];

export type ScheduleView = (typeof SCHEDULE_VIEWS)[number]["key"];
