import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Alto de la píldora (sin la zona segura ni el margen inferior). */
export const TAB_BAR_HEIGHT = 68;

export const useStyles = makeStyles((theme) => {
  const inset = theme.spacing.sm;
  return {
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
      padding: inset,
      borderRadius: theme.radius.xxxl,
      borderWidth: 1,
      borderColor: withAlpha(theme.colors.border, 0.6),
      backgroundColor: theme.colors.glassPanel,
    },
    /** Zona donde se mueve la gota: la barra menos su relleno. */
    track: { position: "absolute", top: inset, right: inset, bottom: inset, left: inset },
    drop: { position: "absolute", top: 0, bottom: 0, left: 0, borderRadius: theme.radius.xxl },
    dropShadow: theme.shadows.glow,
    fill: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: theme.radius.xxl,
      overflow: "hidden",
    },
    /** Brillo extra al llegar: un halo del color de marca que aparece y se apaga. */
    glow: {
      transform: [{ scale: 1.15 }],
      backgroundColor: withAlpha(theme.colors.glowPrimary, 0.35),
    },
  };
});
