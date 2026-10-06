import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex items-center text-[12px] font-semibold text-magenta`, con el área táctil mínima.
  button: { flexDirection: "row", alignItems: "center", minHeight: theme.touchTarget / 2, paddingLeft: theme.spacing.sm },
}));
