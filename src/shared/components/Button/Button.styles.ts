import { makeStyles } from "@/shared/hooks/makeStyles";

// Botón de Playtopia: píldora; el principal con el degradado de marca.

export const useStyles = makeStyles((theme) => ({
  pressable: {
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  body: {
    minHeight: theme.controlHeight,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  solid: { backgroundColor: theme.colors.primary },
  solidInactive: { backgroundColor: theme.colors.inactive, opacity: 0.5 },
  secondary: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  link: {
    minHeight: theme.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  linkText: { textDecorationLine: "underline" },
  pressed: { opacity: 0.8 },
}));
