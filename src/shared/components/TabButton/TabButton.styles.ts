import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  button: {
    flex: 1,
    height: "100%",
    minHeight: theme.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: theme.radius.xxl,
  },
  active: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: theme.radius.xxl,
    ...theme.shadows.glow,
  },
  inactiveLabel: { opacity: 0.8 },
}));
