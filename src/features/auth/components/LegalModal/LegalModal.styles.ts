import { BRAND } from "@/shared/config/brand";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

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
    backgroundColor: withAlpha(BRAND.black, 0.5),
  },
  card: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    maxHeight: "70%",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: withAlpha(BRAND.white, 0.3),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md + theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: withAlpha(BRAND.white, 0.1),
    gap: theme.spacing.sm,
  },
  title: { flex: 1 },
  close: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    borderRadius: theme.touchTarget / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withAlpha(BRAND.white, 0.1),
    borderWidth: 1,
    borderColor: withAlpha(BRAND.white, 0.2),
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
    backgroundColor: withAlpha(BRAND.white, 0.1),
    borderWidth: 1,
    borderColor: withAlpha(BRAND.white, 0.2),
  },
  summary: { lineHeight: 24, textAlign: "justify" },
  action: { alignSelf: "stretch", gap: theme.spacing.sm },
}));
