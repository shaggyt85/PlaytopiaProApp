import { makeStyles } from "@/shared/hooks/makeStyles";

const CARD_MAX_WIDTH = 400;
const ICON_CIRCLE = 80;

export const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.overlay,
  },
  card: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    maxHeight: "70%",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
  },
  // Sin esto el degradado mide todo el texto, la tarjeta lo recorta y el
  // scroll no tiene nada que desplazar: «Aceptar» queda fuera de la vista.
  body: { flexShrink: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md + theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
    gap: theme.spacing.sm,
  },
  title: { flex: 1 },
  close: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    borderRadius: theme.touchTarget / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.hairline,
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
  },
  content: {
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.hairline,
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
  },
  summary: { lineHeight: 24, textAlign: "justify" },
  action: { alignSelf: "stretch", gap: theme.spacing.sm },
}));
