import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  button: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    minHeight: theme.touchTarget,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: theme.radius.xxl,
  },
  inactiveLabel: { opacity: 0.8 },
}));
