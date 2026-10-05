import { STRIPE_WIDTH } from "@/shared/components/StripeCard";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** El cuadrado de la flecha (`h-9 w-9`). */
const CHEVRON_BOX = 36;

export const useStyles = makeStyles((theme) => ({
  // `p-5 pl-6`: deja libre la franja.
  content: {
    padding: theme.spacing.md + theme.spacing.xs,
    paddingLeft: theme.spacing.lg + STRIPE_WIDTH,
  },
  // `flex items-start justify-between gap-3`.
  top: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing.sm + theme.spacing.xs },
  titles: { flex: 1 },
  // `mt-1.5`; la fila y su hueco, de `IconText`.
  level: { marginTop: theme.spacing.xs + theme.spacing.xs / 2 },
  // `grid h-9 w-9 place-items-center rounded-xl border bg-surface-2`.
  chevron: {
    width: CHEVRON_BOX,
    height: CHEVRON_BOX,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surfaceStrong,
  },
  // `mt-4 space-y-2`.
  meta: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  // `mt-5 flex items-center justify-between border-t pt-4`.
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.md + theme.spacing.xs,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },
  // Las plazas: `rounded-full px-3 py-1`, sobre su color al 10 %.
  seats: {
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
  },
}));
