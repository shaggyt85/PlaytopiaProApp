import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Alto de la píldora (sin la zona segura ni el margen inferior). */
export const TAB_BAR_HEIGHT = 68;

export const useStyles = makeStyles((theme) => ({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing.md,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.radius.xxxl,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.border, 0.6),
    backgroundColor: theme.colors.glassPanel,
  },
}));
