import { makeStyles } from "@/shared/hooks/makeStyles";

/** Las flechas del prototipo (`h-9 w-9`): el `hitSlop` de `IconButton` completa el área táctil. */
export const ARROW_SIZE = 36;
/** El texto del centro no baila al cambiar de «Hoy» a «Lun 18 sept» (`min-w-[108px]`). */
const CURRENT_MIN_WIDTH = 108;

export const useStyles = makeStyles((theme) => ({
  // `mt-2 flex items-center justify-center gap-1`.
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  // `min-w-[108px] rounded-full px-3 py-1`, a la altura del área táctil mínima.
  current: {
    minWidth: CURRENT_MIN_WIDTH,
    minHeight: theme.touchTarget,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.pill,
    flexShrink: 1,
  },
  // `mb-2 mt-2`.
  tabs: { marginVertical: theme.spacing.sm },
  // `active:scale-95`.
  pressed: { transform: [{ scale: 0.95 }] },
}));
