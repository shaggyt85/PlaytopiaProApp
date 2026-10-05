import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** La pastilla del nivel, como mínimo (`min-w-[2.75rem]`). */
const BADGE_MIN_WIDTH = 44;

export const useStyles = makeStyles((theme) => ({
  // `mt-4 flex items-center gap-4`.
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md, marginTop: theme.spacing.md },
  texts: { flex: 1 },
  // `mt-1.5 flex items-center gap-2`.
  level: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs + theme.spacing.xs / 2,
  },
  // `rounded-full border border-magenta/50 px-2.5 py-0.5`, con su degradado y su
  // brillo magenta. Sin `overflow: hidden`: recortaría el brillo; el degradado
  // lleva su propio radio.
  badge: {
    minWidth: BADGE_MIN_WIDTH,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.5),
    ...theme.shadows.glow,
  },
  badgeFill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.pill },
}));
