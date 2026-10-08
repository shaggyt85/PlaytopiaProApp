import { glow } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

const ICON_CIRCLE = 64;

export const useStyles = makeStyles((theme) => ({
  header: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  // El icono en su círculo magenta, con el brillo de marca.
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
    backgroundColor: withAlpha(theme.colors.primary, 0.2),
    ...glow(theme.colors.glowPrimary),
  },
  body: { marginBottom: theme.spacing.xl },
  actions: { gap: theme.spacing.sm + theme.spacing.xs },
}));
