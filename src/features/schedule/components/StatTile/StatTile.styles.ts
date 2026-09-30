import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El icono (`h-4 w-4`). */
export const ICON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/20 px-2 py-3`.
  tile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    backgroundColor: withAlpha(theme.colors.background, 0.2),
  },
  // `opacity-80` el icono y `opacity-90` el texto.
  icon: { opacity: 0.8 },
  label: { opacity: 0.9 },
}));
