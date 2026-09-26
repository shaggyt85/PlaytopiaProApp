import { makeStyles } from "@/shared/hooks/makeStyles";

// Botón de Playtopia: píldora; el principal con el degradado de marca.
const BUTTON_HEIGHT = 48;

export const useStyles = makeStyles((theme) => ({
  pressable: {
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  body: {
    minHeight: BUTTON_HEIGHT,
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
  linkText: {
    fontSize: 15,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  pressed: { opacity: 0.8 },
}));
