import type { TextVariant } from "@/shared/config/theme";
import type { TranslationKey } from "@/shared/locales";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El estado de una clase que se marca con una pastilla. */
export type StatusPillVariant = "live" | "next";

/** El texto de cada pastilla. */
export const STATUS_PILL_TEXT = {
  live: { label: "schedule.week.live", variant: "statusBadge" },
  next: { label: "schedule.day.next", variant: "badge" },
} as const satisfies Record<StatusPillVariant, { label: TranslationKey; variant: TextVariant }>;

export const useStyles = makeStyles((theme) => ({
  // `rounded-full px-1.5 py-0.5`, sin encogerse junto a un título largo.
  pill: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.xs + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
  },
  // «EN VIVO»: `bg-coral`.
  live: { backgroundColor: theme.accents.coral.color },
  // «PRÓXIMA»: `bg-background/30 ring-1`, la tarjeta de fondo oscurecida.
  next: {
    backgroundColor: withAlpha(theme.colors.background, 0.3),
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
  },
}));
