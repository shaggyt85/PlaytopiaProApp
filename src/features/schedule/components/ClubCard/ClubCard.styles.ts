import { makeStyles } from "@/shared/hooks/makeStyles";

/** El cuadrado del club (`h-12 w-12`). */
export const SQUARE_SIZE = 48;
/** El icono de la dirección (`h-3 w-3`). */
export const PIN_SIZE = 12;

export const useStyles = makeStyles((theme) => ({
  // `flex items-start gap-3 rounded-2xl bg-surface p-3 ring-soft`.
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  },
  content: { flex: 1, minWidth: 0 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, marginTop: theme.spacing.xs / 2 },
  address: { flexShrink: 1 },
}));
