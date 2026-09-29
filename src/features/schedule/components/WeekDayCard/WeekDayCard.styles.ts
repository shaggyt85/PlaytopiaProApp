import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El aro de hoy y del día tocado (`ring-2`). */
const RING = 2;

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl p-4 ring-soft`.
  card: { padding: theme.spacing.md, borderRadius: theme.radius.xxxl },
  // Hoy: `bg-card ring-2 ring-lime/50`; el tocado: `ring-lime/30`; los demás: `bg-card/60`.
  today: {
    borderWidth: RING,
    borderColor: withAlpha(theme.colors.primary, 0.5),
    backgroundColor: theme.colors.card,
  },
  picked: {
    borderWidth: RING,
    borderColor: withAlpha(theme.colors.primary, 0.3),
    backgroundColor: theme.colors.card,
  },
  other: {
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: withAlpha(theme.colors.card, 0.6),
  },
  // `mb-3 flex items-baseline justify-between`.
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm + theme.spacing.xs,
  },
  title: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, flexShrink: 1 },
}));
